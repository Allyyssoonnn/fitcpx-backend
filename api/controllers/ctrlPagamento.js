const moment = require("moment-timezone");
const { tab_empresa, tab_aluno, tab_usuario_pagamento, tab_aluno_contrato_pagamento, tab_empresa_cartao, tab_aluno_cartao, tab_aluno_contrato } = require('../../database/models');
const { buscarClienteIdUsuario, criarClienteUsuario, criarCobranca, cancelarCobranca, getPix, getTokenCard, criarCobrancaCartao, criarAssinatura, criarSubConta, buscarClienteId, criarCobrancaPIX, criarCliente, buscarSaldoSubConta, buscarExtratoSubConta, realizarSaque } = require('../asaas');
const env = process.env.NODE_ENV || 'development';

async function cashWithdrawal(req, res) {
    const { cod_empresa } = req.body;
    var apikey;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;

    if (!apikey) {
        res.send({ status: false, message: 'Nenhuma chave de api relacionada a empresa.' });
        return;
    }

    const balance = await buscarSaldoSubConta(apikey);
    const bankExtract = await realizarSaque(apikey, null, null, balance);

    res.send({ status: true });
}

async function getBankExtract(req, res) {
    const { cod_empresa, month, year } = req.body;
    var apikey;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;

    if (!apikey) {
        res.send({ status: false, message: 'Nenhuma chave de api relacionada a empresa.' });
        return;
    }

    const bankExtract = await buscarExtratoSubConta(apikey, month, year);

    res.send({ status: true, bankExtract });
}

async function getBalance(req, res) {
    const { cod_empresa } = req.body;
    var apikey;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;

    if (!apikey) {
        res.send({ status: false, message: 'Nenhuma chave de api relacionada a empresa.' });
        return;
    }

    const balance = await buscarSaldoSubConta(apikey);

    res.send({ status: true, balance });
}

async function gerarIdCarteira(req, res) {
    const { cod_empresa } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const resp = await criarSubConta(empresa);

    if (resp?.errors?.length) {
        res.send({ status: false, message: resp.errors[0].description });
        return;
    }

    if (env !== 'development') {
        if (!empresa.asaas_id) {
            await tab_empresa.update({
                asaas_id: resp.id,
                walletid_empresa: resp.walletId,
                asaas_apikey: resp.apiKey,
            }, { where: { cod_empresa } });
        }
    } else {
        if (!empresa.dev_asaas_id) {
            await tab_empresa.update({
                dev_asaas_id: resp.id,
                dev_walletid_empresa: resp.walletId,
                dev_asaas_apikey: resp.apiKey,
            }, { where: { cod_empresa } });
        }
    }

    const empresaAtt = await tab_empresa.findOne({ where: { cod_empresa } });

    res.send({ status: true, empresa: empresaAtt });
}

async function criarPagamentoAluno(req, res) {
    const { cod_aluno, cod_empresa, cod_usuario, cod_aluno_cartao, dadosCartao, cod_aluno_contrato, formaPagamento, mensal, pagamentoInicial = new Date() } = req.body;
    var tokenCartao;
    var apikey;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    const aluno_contrato = await tab_aluno_contrato.findOne({ where: { cod_aluno_contrato } });

    apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;

    if (!apikey) {
        res.send({ status: false, message: 'Nenhuma chave de api relacionada a empresa.' });
        return;
    }

    var clienteId = await buscarClienteId(cod_aluno, apikey);
    if (!clienteId) clienteId = await criarCliente(
        aluno.nome_aluno,
        aluno.email_aluno,
        aluno.doc_aluno,
        aluno.telefone_aluno,
        aluno.endereco_aluno,
        aluno.numero_aluno,
        aluno.estado_aluno,
        aluno.cep_aluno,
        cod_aluno,
        null,
        apikey
    );

    if (cod_aluno_cartao) {
        const cartaoAssas = await tab_aluno_cartao.findOne({ where: { cod_aluno_cartao } });
        if (cartaoAssas) tokenCartao = cartaoAssas.token_empresa_cartao;
    }

    if (dadosCartao) {
        const cartaoAssas = await getTokenCard(clienteId, dadosCartao, '', apikey);
        if (cartaoAssas) {
            tokenCartao = cartaoAssas.creditCardToken;
            await tab_aluno_cartao.create({
                cod_aluno,
                cod_usuario,
                final_aluno_cartao: cartaoAssas.creditCardNumber,
                bandeira_aluno_cartao: cartaoAssas.creditCardBrand,
                token_aluno_cartao: cartaoAssas.creditCardToken,
                json_aluno_cartao: JSON.stringify(cartaoAssas),
            });
        }
    }

    const resumoParcelas = JSON.parse(aluno_contrato?.parcela_aluno_contrato);

    const valor = mensal ? resumoParcelas[0] : aluno_contrato.total_aluno_contrato;

    // GERA O PAGAMENTO DA ADESÃO COM A DATA INICIAL
    if (aluno_contrato?.adesao_aluno_contrato) {
        var cobrancaAdesao;
        
        if (formaPagamento === 'PIX') {
            cobrancaAdesao = await criarCobrancaPIX(clienteId, null, valor, apikey);
        } else if (formaPagamento === 'CREDIT_CARD'){
            cobrancaAdesao = await criarCobrancaCartao(clienteId, null, aluno_contrato.adesao_aluno_contrato, pagamentoInicial, tokenCartao, '', apikey);
        } else if (formaPagamento === 'AFTER'){
            //Envia cobrança sem dados do cartão para gerar billingType = "UNDEFINED"
            cobrancaAdesao = await criarCobrancaCartao(clienteId, null, aluno_contrato.adesao_aluno_contrato, pagamentoInicial, tokenCartao, '', apikey);
        }

        if (cobrancaAdesao?.errors?.length >= 1) {
            const error = cobranca?.errors[0];
            res.send({ status: false, message: error.description });
            return;
        }

        await tab_aluno_contrato_pagamento.create({
            cod_aluno_contrato,
            id_aluno_contrato_pagamento: cobrancaAdesao.id,
            json_aluno_contrato_pagamento: JSON.stringify(cobrancaAdesao),
            status_aluno_contrato_pagamento: cobrancaAdesao.status,
            observacao_aluno_contrato_pagamento: 'Adesão',
            valor_aluno_contrato_pagamento: cobrancaAdesao.value,
            liquido_aluno_contrato_pagamento: cobrancaAdesao?.netValue || cobrancaAdesao.value,
            forma_aluno_contrato_pagamento: formaPagamento,
            data_aluno_contrato_pagamento: cobrancaAdesao.dateCreated,
            expiracao_aluno_contrato_pagamento: cobrancaAdesao.dueDate,
            ambiente_aluno_contrato_pagamento: process.env.NODE_ENV,
        });
    }

    const assinatura = await criarAssinatura(clienteId, tokenCartao, aluno_contrato?.cod_aluno_contrato,
        resumoParcelas[0], pagamentoInicial, resumoParcelas.length, aluno_contrato.nome_aluno_contrato, apikey
    );

    if (assinatura?.errors?.length >= 1) {
        const error = cobranca?.errors[0];
        res.send({ status: false, message: error.description });
        return;
    }

    if (assinatura?.id) {
        await tab_aluno_contrato.update({ id_aluno_contrato: assinatura.id }, { where: { cod_aluno_contrato: aluno_contrato.cod_aluno_contrato } });
    }

    res.send({ status: true });
}

async function createCardToken(req, res) {
    const { dadosCartao, cod_empresa, cod_aluno } = req.body;
    var tokenCartao;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;

    var clienteId = await buscarClienteId(cod_aluno, apikey);
    if (!clienteId) clienteId = await criarCliente(
        aluno.nome_aluno,
        aluno.email_aluno,
        aluno.doc_aluno,
        aluno.telefone_aluno,
        aluno.endereco_aluno,
        aluno.numero_aluno,
        aluno.estado_aluno,
        aluno.cep_aluno,
        cod_aluno,
        null,
        apikey
    );
    
    const cartaoAssas = await getTokenCard(clienteId, dadosCartao, '', apikey);
    if (cartaoAssas) {
        tokenCartao = cartaoAssas.creditCardToken;
        await tab_aluno_cartao.create({
            cod_aluno,
            final_aluno_cartao: cartaoAssas.creditCardNumber,
            bandeira_aluno_cartao: cartaoAssas.creditCardBrand,
            token_aluno_cartao: cartaoAssas.creditCardToken,
            json_aluno_cartao: JSON.stringify(cartaoAssas),
        });
    }

    res.send({ status: true });
}

async function getPIXPagamentoAluno(req, res) {
    const { cod_aluno_contrato_pagamento, cod_empresa } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    apikey = env === 'development' ? empresa.dev_asaas_apikey : empresa.asaas_apikey;
    const pagamento = await tab_aluno_contrato_pagamento.findOne({ where: { cod_aluno_contrato_pagamento } });
    const pix = await getPix(pagamento.id_aluno_contrato_pagamento, apikey);

    res.send({ status: true, pix });
}

async function getPIXPagamento(req, res) {
    const { cod_usuario_pagamento } = req.body;

    const pagamento = await tab_usuario_pagamento.findOne({ where: { cod_usuario_pagamento } });
    const pix = await getPix(pagamento.id_usuario_pagamento);
    
    res.send({ status: true, pix });
}

async function getPagamentos(req, res) {
    const { cod_empresa } = req.body;

    const pagamentos = await tab_usuario_pagamento.findAll({
        where: { cod_empresa },
        order: [['cod_usuario_pagamento', 'DESC']]
    });

    res.send({ status: true, pagamentos });
}

async function deletePagamento(req, res) {
    const { cod_usuario_pagamento } = req.body;

    const pagamento = await tab_usuario_pagamento.findOne({ where: { cod_usuario_pagamento } });

    var deleted = false;
    if (pagamento?.id_usuario_pagamento) {
        deleted = await cancelarCobranca(pagamento.id_usuario_pagamento);
        if (deleted) await tab_usuario_pagamento.update({ status_usuario_pagamento: 'DELETED' }, { where: { cod_usuario_pagamento } });
    }

    res.send({ status: deleted });
}

async function getCartoes(req, res) {
    const { cod_empresa } = req.body;
    const cartoes = await tab_empresa_cartao.findAll({ 
        where: { cod_empresa },
        attributes: ['cod_empresa_cartao', 'final_empresa_cartao', 'bandeira_empresa_cartao']
    });
    res.send({ status: true, cartoes })
}

async function deleteCartao(req, res) {
    const { cod_empresa_cartao } = req.body;
    await tab_empresa_cartao.update({ deletedAt: new Date() }, { where: { cod_empresa_cartao } });
    res.send({ status: true });
}

module.exports = {
    cashWithdrawal,
    getBankExtract,
    getBalance,
    gerarIdCarteira,
    criarPagamentoAluno,
    createCardToken,
    getPIXPagamentoAluno,
    getPIXPagamento,
    getPagamentos,
    deletePagamento,
    getCartoes,
    deleteCartao,
}