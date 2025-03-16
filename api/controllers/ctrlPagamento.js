const moment = require("moment-timezone");
const { tab_empresa, tab_pagamento_usuario, tab_empresa_cartao } = require('../../database/models');
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

    const pagamento = await tab_pagamento_usuario.create({
        cod_usuario,
        cod_empresa,
        id_pagamento_usuario: cobranca.id,
        assinatura_pagamento_usuario: recorrente ? cobranca.id : null,
        json_pagamento_usuario: JSON.stringify(cobranca),
        status_pagamento_usuario: cobranca.status,
        valor_pagamento_usuario: cobranca.value,
        liquido_pagamento_usuario: cobranca?.netValue || cobranca.value,
        forma_pagamento_usuario: formaPagamento,
        data_pagamento_usuario: cobranca.dateCreated,
        expiracao_pagamento_usuario: moment(cobranca.dateCreated).add(30, 'days').format('YYYY-MM-DD'),
        parcela_pagamento_usuario: 1,
        tipo_pagamento_usuario: recorrente ? 'Recorrência' : 'Único',
        ambiente_pagamento_usuario: process.env.NODE_ENV,
    });

    res.send({ status: true, pagamento });
}

async function getPIXPagamento(req, res) {
    const { cod_pagamento_usuario } = req.body;

    const pagamento = await tab_pagamento_usuario.findOne({ where: { cod_pagamento_usuario } });
    const pix = await getPix(pagamento.id_pagamento_usuario);
    
    res.send({ status: true, pix });
}

async function getPagamentos(req, res) {
    const { cod_empresa } = req.body;

    const pagamentos = await tab_pagamento_usuario.findAll({
        where: { cod_empresa },
        order: [['cod_pagamento_usuario', 'DESC']]
    });

    res.send({ status: true, pagamentos });
}

async function deletePagamento(req, res) {
    const { cod_pagamento_usuario } = req.body;

    const pagamento = await tab_pagamento_usuario.findOne({ where: { cod_pagamento_usuario } });

    var deleted = false;
    if (pagamento?.id_pagamento_usuario) {
        deleted = await cancelarCobranca(pagamento.id_pagamento_usuario);
        if (deleted) await tab_pagamento_usuario.update({ status_pagamento_usuario: 'DELETED' }, { where: { cod_pagamento_usuario } });
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