const { Sequelize } = require('sequelize');
const { tab_aluno, tab_aluno_cartao, tab_avaliacao, tab_avaliacao_imagem, tab_usuario, tab_empresa, tab_aluno_contrato, tab_aluno_contrato_pagamento } = require('../../database/models');
const { removeStringVazia } = require('../../utils');
const moment = require("moment-timezone");
const { atualizarCliente, buscarClienteId, buscarPagamentosAssinatura, cancelarAssinatura } = require('../asaas');
const { sendDocument, deleteDocument, downloadContract } = require('../autentique');
const env = process.env.NODE_ENV || 'development';

async function getAlunos(req, res) {    
    const { cod_usuario, cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : { deletedAt: null };
    const alunos = await tab_aluno.findAll({
        where: where,
        paranoid: !deleted,
        include: [
            { model: tab_avaliacao, as: 'avaliacao' },
            { model: tab_usuario, as: 'usuario', where: { cod_empresa } },
        ],
        attributes: { exclude: ['senha_aluno'] },
        order: [['nome_aluno', 'ASC']]
    });
    res.send({ status: true, alunos });
}

async function getAluno(req, res) {    
    const { cod_aluno } = req.body;
    const aluno = await tab_aluno.findOne({
        where: { cod_aluno: cod_aluno },
        include: [
            {
                model: tab_avaliacao,
                as: 'avaliacao',
                include: [
                    {
                        model: tab_avaliacao_imagem,
                        as: 'imagem',
                    }
                ]
            }
        ]
    });    
    res.send({ status: true, aluno });
}

async function getCards(req, res) {
    const { cod_aluno } = req.body;

    const cards = await tab_aluno_cartao.findAll({
        where: { cod_aluno },
        attributes: { exclude: ['token_aluno_cartao'] }
    });
    res.send({ status: true, cards });
}

async function deleteCard(req, res) {
    const { cod_aluno_cartao } = req.body;
    
    await tab_aluno_cartao.update({ deletedAt: new Date() }, { where: { cod_aluno_cartao } });
    res.send({ status: true });
}

async function setAluno(req, res) {    
    const { aluno } = req.body;
    var alunoAtt;

    if (aluno?.cod_aluno) alunoAtt = await tab_aluno.findOne({ where: { cod_aluno: aluno.cod_aluno } });
    
    if (alunoAtt) {
        await tab_aluno.update(aluno, { where: { cod_aluno: aluno.cod_aluno } });

        //Verifica se cliente está cadastrado no asaas e atualiza informações
        const empresa = await tab_empresa.findOne({ where: { cod_empresa: aluno.cod_empresa } });
        const apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;
        if (apikey) {
            const clienteId = await buscarClienteId(aluno.cod_aluno, apikey);
            if (clienteId) {
                await atualizarCliente(clienteId, aluno.nome_aluno, aluno.cpf_aluno, aluno.email_aluno, aluno.telefone_aluno, apikey);
            }
        }
    } else {
        const novoAluno = await tab_aluno.create(aluno);
        alunoAtt = novoAluno;
    }
    res.send({ status: true, aluno: alunoAtt });
}

async function deleteAluno(req, res) {
    const { cod_aluno } = req.body;
    await tab_aluno.update({ deletedAt: new Date() }, { where: { cod_aluno: cod_aluno } });
    res.send({ status: true });
}

async function recoveryAluno(req, res) {
    const { cod_aluno } = req.body;
    await tab_aluno.update({ deletedAt: null }, { where: { cod_aluno: cod_aluno }, paranoid: false });
    res.send({ status: true });
}

async function getAvaliacoes(req, res) {    
    const { cod_empresa, cod_aluno } = req.body;
    const whereEmpresa = cod_empresa ? { cod_empresa } : null;
    const whereAluno = cod_aluno ? { cod_aluno } : null;

    const avaliacoes = await tab_avaliacao.findAll({
        include: [
            {
                model: tab_aluno,
                as: 'aluno',
                required: true,
                where: whereAluno,
                include: [
                    {
                        model: tab_usuario,
                        as: 'usuario',
                        required: true,
                        include: [
                            {
                                model: tab_empresa,
                                as: 'empresa',
                                required: true,
                                where: whereEmpresa,
                            }
                        ]
                    }
                ],
            },
            {
                model: tab_avaliacao_imagem,
                as: 'imagem',
            }
        ],
    });
    const avaliacoesLimpa = avaliacoes.map(avaliacao => avaliacao.toJSON());
    // for (const av of avaliacoes) av.nome_aluno = av.aluno.nome_aluno;
    // Reorganizando os dados para que nome_aluno seja o primeiro atributo
    const avaliacoesFormatadas = avaliacoesLimpa.map(av => ({
        nome_aluno: av.aluno?.nome_aluno, // Primeiro atributo
        ...av, // Outros atributos
    }));
    res.send({ status: true, avaliacoes: avaliacoesFormatadas });
}

async function getAvaliacao(req, res) {
    const { cod_avaliacao } = req.body;
    const avaliacao = await tab_avaliacao.findOne({ where: { cod_avaliacao: cod_avaliacao } });
    res.send({ status: true, avaliacao });
}

async function setAvaliacao(req, res) {    
    const { avaliacao: avaliacaoReq } = req.body;
    var avaliacaoAtt;

    const avaliacao = removeStringVazia(avaliacaoReq);

    if (avaliacao.cod_avaliacao) avaliacaoAtt = await tab_avaliacao.findOne({ where: { cod_aluno: avaliacao.cod_aluno } });

    if (avaliacaoAtt) {
        await tab_avaliacao.update(avaliacao, { where: { cod_avaliacao: avaliacao.cod_avaliacao } });
    } else {
        const novoAluno = await tab_avaliacao.create(avaliacao);
        avaliacaoAtt = novoAluno;
    }

    res.send({ status: true, avaliacao: avaliacaoAtt });
}

async function deleteAvaliacao(req, res) {
    const { cod_avaliacao } = req.body;
    await tab_avaliacao.update({ deletedAt: new Date() }, { where: { cod_avaliacao: cod_avaliacao } });
    res.send({ status: true });
}

async function setAlunoContrato(req, res) {
    const { plano } = req.body;

    const { modalidades, valor_plano, valor_adesao, contrato, duracao_plano, nome_plano, cod_aluno, cod_usuario, cod_empresa, parcela_plano, pagamentoInicial = new Date() } = plano;

    const alunoContrato = await tab_aluno_contrato.create({
        cod_aluno: cod_aluno,
        cod_usuario: cod_usuario,
        cod_empresa: cod_empresa,
        nome_aluno_contrato: nome_plano ?? `Contrato ${moment().format('DD/MM/YYYY')}`,
        iniciopagamento_aluno_contrato: pagamentoInicial,
        adesao_aluno_contrato: valor_adesao,
        parcela_aluno_contrato: parcela_plano,
        total_aluno_contrato: valor_plano,
        arquivo_aluno_contrato: contrato,
        expiracao_aluno_contrato: moment().tz('America/Sao_Paulo').add(duracao_plano, 'months').format('YYYY-MM-DD'),
        modalidades_aluno_contrato: JSON.stringify(modalidades),
        ambiente_aluno_contrato: env,
    });

    res.send({ status: true, alunoContrato });
}

async function cancelAlunoContrato(req, res) {
    const { cod_aluno_contrato } = req.body;

    const alunoContrato = await tab_aluno_contrato.findOne({ where: { cod_aluno_contrato } });
    const empresa = await tab_empresa.findOne({ where: { cod_empresa: alunoContrato.cod_empresa } });

    if (alunoContrato?.autentique_aluno_contrato) await deleteDocument(alunoContrato.autentique_aluno_contrato);
    
    apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;

    if (alunoContrato?.id_aluno_contrato) {
        await cancelarAssinatura(alunoContrato.id_aluno_contrato, apikey);
        await tab_aluno_contrato.update({ deletedAt: new Date() }, { where: { cod_aluno_contrato } });
    } else {
        await tab_aluno_contrato.update({ deletedAt: new Date() }, { where: { cod_aluno_contrato } });
    }

    res.send({ status: true });
}

async function sendAlunoContrato(req, res) {
    const { cod_aluno_contrato } = req.body;
    const contratoPDF = req.file;

    const alunoContrato = await tab_aluno_contrato.findOne({ where: { cod_aluno_contrato } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno: alunoContrato.cod_aluno } });

    if (alunoContrato.arquivo_aluno_contrato) {
        const respAutentique = await sendDocument(contratoPDF, aluno.email_aluno);
        if (respAutentique) tab_aluno_contrato.update({ autentique_aluno_contrato: respAutentique, statusautentique_aluno_contrato: 'Contrato enviado.' }, { where: { cod_aluno_contrato } });
        res.send({ status: true });
        return;
    }

    res.send({ status: true });
}

async function downloadAlunoContrato(req, res) {
    const { cod_aluno_contrato, signed } = req.body;
    const alunoContrato = await tab_aluno_contrato.findOne({ where: { cod_aluno_contrato } });

    if (alunoContrato?.autentique_aluno_contrato) {
        const resp = await downloadContract(alunoContrato.autentique_aluno_contrato, signed);
        if (resp) {
            res.send({ status: true, url: resp });
        } else res.send({ status: false });
        return;
    }

    res.send({ status: true });
}

async function getAlunoContratos(req, res) {
    const { cod_aluno, cod_empresa } = req.body;

    var where = {};
    if (env !== 'development') where = { ambiente_aluno_contrato: { [Sequelize.Op.ne]: 'development' } };
    if (cod_aluno) where = { ...where, cod_aluno: cod_aluno };
    if (cod_empresa) where = { ...where, cod_empresa: cod_empresa };

    const alunoContratos = await tab_aluno_contrato.findAll({
        where: where,
        include: [
            {
                model: tab_aluno,
                as: 'aluno',
            }
        ]
    });

    res.send({ status: true, alunoContratos });
}

async function getAlunoContrato(req, res) {
    const { cod_aluno_contrato, cod_empresa } = req.body;

    var where = {};
    if (cod_aluno_contrato) where = { ...where, [Sequelize.Op.or]: [ { cod_aluno_contrato: cod_aluno_contrato }, { cod_aluno_contrato: null } ] };

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    
    const alunoContrato = await tab_aluno_contrato.findOne({
        where: where,
        include: [
            { model: tab_aluno_contrato_pagamento, as: 'pagamentos' },
        ]
    });

    //DESATIVADO - 28/04/2025 - WEBHOOK TEM QUE ESTAR FUNCIONANDO BEM
    //Check payment not captured by webhook - 2025/04/19
    // if (alunoContrato.id_aluno_contrato) {
    //     const payments = alunoContrato.pagamentos;
    //     const installments = JSON.parse(alunoContrato.parcela_aluno_contrato);
    //     const dueDate = [];
    //     const startDate = alunoContrato.iniciopagamento_aluno_contrato ? moment(alunoContrato.iniciopagamento_aluno_contrato) : moment(new Date());
    //     const today = new Date();

    //     // Order appPayments
    //     const lastPayment = payments.sort((a, b) => new Date(b.expiracao_aluno_contrato_pagamento) - new Date(a.expiracao_aluno_contrato_pagamento))[0];
    //     // Get last appPayment
    //     const lastPaymentDate = lastPayment?.expiracao_aluno_contrato_pagamento ? moment(lastPayment?.expiracao_aluno_contrato_pagamento) : null;

    //     // Get all payments date from installments
    //     for (let i = 0; i < installments.length; i++) {
    //         const date = startDate.clone().add(i, 'month');
    //         dueDate.push(date.format('YYYY-MM-DD'));
    //     }

    //     // Get next dueDates
    //     const futureDueDates = dueDate.filter(d => moment(d).isSameOrAfter(today));

    //     // Get next dueDate
    //     const nextDueDate = futureDueDates.length ? futureDueDates.reduce((closest, current, index) => {
    //         return moment(current).diff(today) < moment(closest).diff(today) ? current : closest;
    //     }) : null;

    //     const isToday = moment(nextDueDate).isSame(today, 'day');
    //     const passed = moment(nextDueDate).isSameOrAfter(today, 'day');
    //     const existPayment = moment(nextDueDate).isSameOrAfter(lastPaymentDate, 'day');

    //     if ((isToday || passed) && !existPayment) {
    //         const apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;
    //         const asaasPayments = await buscarPagamentosAssinatura(alunoContrato.id_aluno_contrato, apikey);
    //         const appPayments = alunoContrato.pagamentos;

    //         const reorderAsaasPayments = asaasPayments.sort((a, b) => {
    //             const dateA = new Date(a.dueDate);
    //             const dateB = new Date(b.dueDate);
    //             return dateA - dateB;
    //         });

    //         for (let i = 0; i < reorderAsaasPayments.length; i++) {
    //             const asaasPayment = reorderAsaasPayments[i];
                
    //             const existPayment = appPayments.find((payment) => payment.id_aluno_contrato_pagamento === asaasPayment.id);
    //             if (!existPayment) {
    //                 await tab_aluno_contrato_pagamento.create({
    //                     cod_aluno_contrato: alunoContrato.cod_aluno_contrato,
    //                     id_aluno_contrato_pagamento: asaasPayment.id,
    //                     json_aluno_contrato_pagamento: JSON.stringify(asaasPayment),
    //                     status_aluno_contrato_pagamento: asaasPayment.status,
    //                     valor_aluno_contrato_pagamento: asaasPayment.value,
    //                     liquido_aluno_contrato_pagamento: asaasPayment?.netValue || asaasPayment.value,
    //                     forma_aluno_contrato_pagamento: asaasPayment?.billingType,
    //                     data_aluno_contrato_pagamento: asaasPayment.dateCreated,
    //                     expiracao_aluno_contrato_pagamento: asaasPayment.dueDate,
    //                     ambiente_aluno_contrato_pagamento: process.env.NODE_ENV,
    //                 });
    //             }
    //         }
    //     }
    // }

    res.send({ status: true, alunoContrato });
}

module.exports = {
    getAlunos,
    getAluno,
    getCards,
    deleteCard,
    setAluno,
    deleteAluno,
    recoveryAluno,
    getAvaliacoes,
    getAvaliacao,
    setAvaliacao,
    deleteAvaliacao,
    setAlunoContrato,
    cancelAlunoContrato,
    sendAlunoContrato,
    downloadAlunoContrato,
    getAlunoContratos,
    getAlunoContrato,
}