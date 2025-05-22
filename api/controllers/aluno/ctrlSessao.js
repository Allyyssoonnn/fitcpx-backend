const { Sequelize } = require('sequelize');
const { tab_modalidade, tab_aluno, tab_empresa, tab_aluno_sessao_pacote, tab_aluno_sessao_modalidade } = require('../../../database/models');
const { createAccount, getStatusAccount, sendDocuments, deleteAccount, setDefaultPaymentMethod, createCustomer, getSetupIntent, getPaymentsMethod, getBalanceAccount, getExtract, createPayment, getPaymentIntent, refundPayment } = require("../../stripe");
const env = process.env.NODE_ENV || 'development';
const moment = require("moment-timezone");

async function setAlunoSessaoPacote(req, res) {
    const { pacote } = req.body;

    const { modalidades, valor_plano, duracao_sessao, cod_aluno, cod_usuario, cod_empresa } = pacote;

    const alunoSessao = await tab_aluno_sessao_pacote.create({
        cod_aluno: cod_aluno,
        cod_usuario: cod_usuario,
        cod_empresa: cod_empresa,
        nome_aluno_sessao_pacote: `Sessões ${moment().format('DD/MM/YYYY')}`,
        expiracao_aluno_sessao_pacote: duracao_sessao ? moment().tz('America/Sao_Paulo').add(duracao_sessao, 'months').format('YYYY-MM-DD') : null,
        expiracao_aluno_sessao_pacote: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
        valor_aluno_sessao_pacote: valor_plano,
        ambiente_aluno_sessao_pacote: env,
    });

    for (const modalidade of modalidades) {
        for (let i = 0; i < (modalidade?.quantidade_modalidade ?? 1); i++) {
            await tab_aluno_sessao_modalidade.create({
                cod_aluno_sessao_pacote: alunoSessao.cod_aluno_sessao_pacote,
                status_aluno_sessao_modalidade: 'Pending',
                ...modalidade
            });
        }
    }

    res.send({ status: true, alunoSessao });
}

async function createPaySessao(req, res) {
    const { cod_aluno, cod_empresa, cod_usuario, cod_aluno_sessao_pacote, formaPagamento, paymentId } = req.body;
    var accountId;
    var customerId;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });

    accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
    customerId = env === 'development' ? aluno.dev_stripe_id : aluno.stripe_id;

    const alunoSessao = await tab_aluno_sessao_pacote.findOne({ where: { cod_aluno_sessao_pacote } });

    const valor = alunoSessao.valor_aluno_sessao_pacote;

    //Here update sessao to active without payment
    if (formaPagamento === 'MANUAL') {
        await tab_aluno_sessao_pacote.update({
            status_aluno_sessao_pacote: 'succeeded',
            formapagamento_aluno_sessao_pacote: formaPagamento,
        }, { where: { cod_aluno_sessao_pacote } });

        res.send({ status: true });
        return;
    }

    if (!customerId) customerId = await createCustomer(
        aluno.nome_aluno,
        aluno.email_aluno,
        aluno.cpf_aluno,
        aluno.telefone_aluno,
        aluno.endereco_aluno,
        aluno.numero_aluno,
        aluno.cidade_aluno,
        aluno.estado_aluno,
        aluno.cep_aluno,
        cod_aluno,
        null,
        accountId
    );

    if (customerId) {
        var field = env === 'development' ? { dev_stripe_id: customerId } : { stripe_id: customerId };
        await tab_aluno.update(field, { where: { cod_aluno } });
    }

    if (paymentId) {
        await setDefaultPaymentMethod(accountId, customerId, paymentId);
        var field = env === 'development' ? { dev_payment_stripe_id: paymentId } : { payment_stripe_id: paymentId };
        await tab_aluno.update(field, { where: { cod_aluno } });
    }

    //Here generate payment peding
    if (formaPagamento === 'UNICA') {
        const payment = await createPayment(accountId, paymentId, valor, customerId, alunoSessao.nome_aluno_sessao_pacote);
        
        var field = env === 'development' ? { dev_stripe_payment_id: payment.id } : { stripe_payment_id: payment.id };

        await tab_aluno_sessao_pacote.update({
            ...field,
            status_aluno_sessao_pacote: payment.status,
            formapagamento_aluno_sessao_pacote: formaPagamento,
        }, { where: { cod_aluno_sessao_pacote } });

        res.send({ status: true });
        return;
    }

    if (formaPagamento === 'RECORRENTE' && !paymentId) {
        res.send({ status: false, message: 'Opção recorrente selecionada sem um cartão informado!' });
        return;
    }

    //Here pay immediatly
    if (formaPagamento === 'RECORRENTE') {
        const payment = await createPayment(accountId, paymentId, valor, customerId, alunoSessao.nome_aluno_sessao_pacote);
        
        var field = env === 'development' ? { dev_stripe_payment_id: payment.id } : { stripe_payment_id: payment.id };

        await tab_aluno_sessao_pacote.update({
            ...field,
            status_aluno_sessao_pacote: payment.status,
            formapagamento_aluno_sessao_pacote: formaPagamento,
        }, { where: { cod_aluno_sessao_pacote } });

        res.send({ status: true });
        return;
    }

    res.send({ status: true });
}

async function getAlunoSessoesPacote(req, res) {
    const { cod_aluno, cod_empresa } = req.body;

    const where = { ambiente_aluno_sessao_pacote: env !== 'production' ? 'development' : 'production' };
    if (cod_aluno) where.cod_aluno = cod_aluno;
    if (cod_empresa) where.cod_empresa = cod_empresa;

    const alunoSessoes = await tab_aluno_sessao_pacote.findAll({
        include: [
            {
                model: tab_aluno,
                as: 'aluno',
            },
            {
                model: tab_aluno_sessao_modalidade,
                as: 'sessoes',
                include: [
                    {
                        model: tab_modalidade,
                        as: 'modalidade',
                    },
                ],
            },
        ],
        where
    });

    res.send({ status: true, alunoSessoes });
}

async function getAlunoSessaoPacote(req, res) {
    const { cod_aluno_sessao_pacote } = req.body;

    const alunoSessaoPacote = await tab_aluno_sessao_pacote.findOne({
        include: [
            {
                model: tab_aluno,
                as: 'aluno',
            },
            {
                model: tab_aluno_sessao_modalidade,
                as: 'sessoes',
                include: [
                    {
                        model: tab_modalidade,
                        as: 'modalidade',
                    },
                ],
            },
        ],
        where: { cod_aluno_sessao_pacote }
    });

    res.send({ status: true, alunoSessaoPacote });
}

module.exports = {
    setAlunoSessaoPacote,
    createPaySessao,
    getAlunoSessoesPacote,
    getAlunoSessaoPacote,
}