const moment = require("moment-timezone");
const { tab_empresa, tab_usuario_pagamento, tab_empresa_cartao } = require('../../database/models');
const { buscarClienteIdUsuario, criarClienteUsuario, criarCobranca, cancelarCobranca, getPix, getTokenCard, criarCobrancaCartao, criarAssinatura } = require('../asaas');

async function processPagamento(req, res) {
    const { formaPagamento, cod_empresa, cod_usuario, recorrente, cartao, meuip = null, cod_empresa_cartao } = req.body;
    var tokenCartao;
    var cobranca;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    var clienteId = await buscarClienteIdUsuario(cod_empresa);
    if (!clienteId) clienteId = await criarClienteUsuario(
        empresa.nome_empresa,
        empresa.email_empresa,
        empresa.doc_empresa,
        empresa.telefone_empresa,
        empresa.endereco_empresa,
        empresa.numero_empresa,
        empresa.estado_empresa,
        empresa.cep_empresa,
        cod_empresa,
        empresa.nome_empresa,
    );

    if (cod_empresa_cartao) {
        const cartaoAssas = await tab_empresa_cartao.findOne({ where: { cod_empresa_cartao } });
        if (cartaoAssas) tokenCartao = cartaoAssas.token_empresa_cartao;
    }
    
    if (cartao) {
        const cartaoAssas = await getTokenCard(clienteId, cartao, meuip);
        if (cartaoAssas) {
            tokenCartao = cartaoAssas.creditCardToken;
            await tab_empresa_cartao.create({
                cod_empresa,
                cod_usuario,
                final_empresa_cartao: cartaoAssas.creditCardNumber,
                bandeira_empresa_cartao: cartaoAssas.creditCardBrand,
                token_empresa_cartao: cartaoAssas.creditCardToken,
                json_empresa_cartao: JSON.stringify(cartaoAssas),
            });
        }
    }

    if (!recorrente && formaPagamento === 'PIX') {
        cobranca = await criarCobranca(clienteId, cod_empresa);
    } else {
        cobranca = await criarCobrancaCartao(clienteId, cod_empresa, tokenCartao, meuip);
    }

    if (recorrente) {
        cobranca = await criarAssinatura(clienteId, tokenCartao);
    }

    const pagamento = await tab_usuario_pagamento.create({
        cod_usuario,
        cod_empresa,
        id_usuario_pagamento: cobranca.id,
        assinatura_usuario_pagamento: recorrente ? cobranca.id : null,
        json_usuario_pagamento: JSON.stringify(cobranca),
        status_usuario_pagamento: cobranca.status,
        valor_usuario_pagamento: cobranca.value,
        liquido_usuario_pagamento: cobranca?.netValue || cobranca.value,
        forma_usuario_pagamento: formaPagamento,
        data_usuario_pagamento: cobranca.dateCreated,
        expiracao_usuario_pagamento: moment(cobranca.dateCreated).add(30, 'days').format('YYYY-MM-DD'),
        parcela_usuario_pagamento: 1,
        tipo_usuario_pagamento: recorrente ? 'Recorrência' : 'Único',
        ambiente_usuario_pagamento: process.env.NODE_ENV,
    });

    res.send({ status: true, pagamento });
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
    processPagamento,
    getPIXPagamento,
    getPagamentos,
    deletePagamento,
    getCartoes,
    deleteCartao,
}