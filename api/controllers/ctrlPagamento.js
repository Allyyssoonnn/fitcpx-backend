const moment = require("moment-timezone");
const { tab_usuario, tab_empresa, tab_aluno, tab_empresa_licenca_pagamento, tab_aluno_contrato_pagamento, tab_empresa_licenca, tab_aluno_cartao, tab_aluno_contrato, tab_aluno_contrato_modalidade, tab_modalidade_variacao, tab_modalidade_variacao_valor, tab_modalidade } = require('../../database/models');
const { criarCliente, getTokenCard, criarCobranca, buscarCobranca, cobrancaRecebida, criarAssinatura } = require("../asaas");
const env = process.env.NODE_ENV || 'development';
const dev = env === 'development';

async function criarPagamentoAluno(req, res) {
    try {
        const {
            cod_aluno, cod_empresa, cod_usuario,
            cod_aluno_contrato, formaPagamento,
            mensal, paymentId, formCard, typePayment
        } = req.body;

        const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
        const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
        const aluno_contrato = await tab_aluno_contrato.findOne({
            where: { cod_aluno_contrato },
            include: [{
                model: tab_aluno_contrato_modalidade,
                as: 'modalidades',
                include: [
                    { model: tab_modalidade_variacao, as: 'variacao' },
                    { model: tab_modalidade_variacao_valor, as: 'variacaoValor' },
                    { model: tab_modalidade, as: 'modalidade' },
                ],
            }],
        });

        const dataInicio = aluno_contrato.iniciopagamento_aluno_contrato ? moment(aluno_contrato.iniciopagamento_aluno_contrato) : new Date();
        const resumoParcelas = JSON.parse(aluno_contrato?.parcela_aluno_contrato);
        const duration = resumoParcelas.length;
        const valor = (formaPagamento === 'RECORRENTE' && duration > 0)
            ? resumoParcelas[0]
            : aluno_contrato.total_aluno_contrato;

        const name = aluno_contrato.modalidades.map(m =>
            `${m.modalidade.nome_modalidade} - ${m.variacao.nome_modalidade_variacao}`
        ).join(', ');

        await tab_aluno_contrato.update({
            status_aluno_contrato: 'Ativo',
            formapagamento_aluno_contrato: formaPagamento,
            tipopagamento_aluno_contrato: typePayment,
            descricao_aluno_contrato: name,
        }, { where: { cod_aluno_contrato } });

        // === MANUAL
        if (formaPagamento === 'MANUAL') {
            const pagamentos = resumoParcelas.slice(1).map((parcela, i) => ({
                cod_aluno_contrato,
                data_aluno_contrato_pagamento: moment().add(i + 1, 'months').toDate(),
                expiracao_aluno_contrato_pagamento: moment().add(i + 1, 'months').toDate(),
                valor_aluno_contrato_pagamento: parcela,
                liquido_aluno_contrato_pagamento: parcela,
                forma_aluno_contrato_pagamento: formaPagamento,
                status_aluno_contrato_pagamento: 'Pendente',
                ambiente_aluno_contrato_pagamento: env,
            }));

            await tab_aluno_contrato_pagamento.bulkCreate(pagamentos);
            return res.send({ status: true });
        }

        // === Definir Getway e billingType
        let getway = 'ASAAS';
        let billingType = typePayment;

        if (billingType == 'CREDIT') billingType = 'CREDIT_CARD';

        // === ASAAS
        if (getway === 'ASAAS') {
            let asaasId = aluno.asaas_id;
            if (!asaasId) {
                asaasId = await criarCliente(
                    aluno.nome_aluno, aluno.email_aluno, aluno.cpf_aluno,
                    aluno.telefone_aluno, aluno.endereco_aluno, aluno.numero_aluno,
                    aluno.estado_aluno, aluno.cep_aluno, aluno.cod_aluno,
                    empresa.nome_empresa
                );
                await tab_aluno.update({ asaas_id: asaasId }, { where: { cod_aluno } });
            }

            const installments = (formaPagamento === 'UNICA' || formaPagamento === 'PARCELADO') ? formCard?.installments : null;

            var value = (formaPagamento === 'UNICA' || formaPagamento === 'PARCELADO') ? valor : resumoParcelas[0];
            
            if (formaPagamento === 'RECORRENTE' && billingType === 'CREDIT_CARD') {
                const respAsaas = await criarAssinatura(
                    asaasId, cod_aluno_contrato, valor,
                    dataInicio, installments, billingType, name
                );
                if (respAsaas.id) {
                    await tab_aluno_contrato.update({
                        asaas_id: respAsaas.id
                    }, { where: { cod_aluno_contrato } });
                }
                console.log(respAsaas);
            } else {
                resumoParcelas.map(async (parcela, i) => {
                    if (i > 0 && (formaPagamento === 'UNICA' || formaPagamento === 'PARCELADO')) return;
                    var value = (formaPagamento === 'UNICA' || formaPagamento === 'PARCELADO') ? valor : parcela;
    
                    const dueDate = moment(dataInicio).add(i, 'months');
                    const respAsaas = await criarCobranca(
                        asaasId, cod_aluno_contrato, value,
                        dueDate, null, null, installments,
                        billingType, name
                    );
                    console.log(respAsaas);
                });
            }
            // pagamento retornará pelo webhook
        }
        
        res.send({ status: true });
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        res.status(500).send({ status: false, error: error.message });
    }
}

async function buscarCobrancaAluno(req, res) {
    try {
        const { id } = req.body;
        const cobranca = await buscarCobranca(id);
        res.send({ status: true, cobranca });
    } catch (error) {
        res.send({ status: false, message: error.message });
    }
}

async function marcarCobrancaRecebida(req, res) {
    try {
        const { asaasId } = req.body;
        await cobrancaRecebida(asaasId);
        res.send({ status: true });
    } catch (error) {
        res.send({ status: false, message: error.message });
    }
}

module.exports = {
    criarPagamentoAluno,
    buscarCobrancaAluno,
    marcarCobrancaRecebida,
}