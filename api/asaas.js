const moment = require("moment-timezone");
// const { tab_usuario_pagamento, tab_asaas_webhook } = require('../database/models');
const env = process.env.NODE_ENV || 'development';

const urlBase = env === 'development'
    ? 'https://api-sandbox.asaas.com/'
    : 'https://api.asaas.com/'
;

const token = env === 'development'
    ? process.env.ASAAS_KEY_DEVELOPMENT
    : process.env.ASAAS_KEY_PRODUCTION
;

async function criarCliente(nome, email, documento, telefone, endereco, numero, estado, cep, cod, nome_empresa = null) {
    const url = `${urlBase}/v3/customers`;
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', access_token: token },
        body: JSON.stringify({
            name: nome,
            cpfCnpj: documento?.replace(/[^\d]+/g, ''),
            email: email,
            phone: telefone,
            address: endereco,
            addressNumber: numero,
            province: estado,
            postalCode: cep,
            externalReference: cod,
            company: nome_empresa,
            groupName: `${cod}_${nome_empresa}`,
            notificationDisabled: true,
        })
    };
    
    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp.id;
}

async function atualizarCliente(customerId, nome, documento, email, telefone, apikey) {
    const url = `${urlBase}/v3/customers/${customerId}`;
    const options = {
        method: 'PUT',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: apikey ?? token },
        body: JSON.stringify({
            name: nome,
            cpfCnpj: documento.replace(/[^\d]+/g, ''),
            email: email,
            phone: telefone,
        })
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return;
}

async function getTokenCard(customerId, cartao, ip) {
    const url = `${urlBase}/v3/creditCard/tokenizeCreditCard`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
        body: JSON.stringify({
            creditCard: {
                number: cartao.number,
                expiryMonth: cartao.month,
                expiryYear: cartao.year,
                ccv: cartao.code,
                holderName: cartao.name,
            },
            customer: customerId,
            remoteIp: ip
        })
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp;
}

async function criarCobranca(customerId, cod, value, dueDate,
    tokenCartao, meuip, installments, billingType, license = false
) {
    const url = `${urlBase}/v3/payments/`;
    const body = {
        billingType, // 'CREDIT_CARD', 'PIX', 'BOLETO'
        customer: customerId,
        value: value,
        dueDate: moment(dueDate).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
        description: license ? 'Use License' : 'FitCpx',
        externalReference: cod,
        postalService: false,
        discount: { type: 'PERCENTAGE', value: 0 },
        interest: { value: 0 },
        fine: { value: 0, type: 'FIXED' },
    };

    if (billingType === 'CREDIT_CARD' && tokenCartao) {
        body.installmentCount = installments || 1;
        body.totalValue = value;
        body.creditCardToken = tokenCartao;
        body.remoteIp = meuip;
        body.callback = {
            successUrl: 'https://fitcpx.com',
            autoRedirect: false,
        };
        body.creditCardHolderInfo = {
            addressComplement: null,
            phone: null,
            mobilePhone: null,
        };
    }

    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
        body: JSON.stringify(body)
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp;
}

async function buscarCobranca(id) {
    const url = `${urlBase}/v3/payments/${id}`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp;
}

module.exports = {
    criarCliente,
    atualizarCliente,
    getTokenCard,
    criarCobranca,
    buscarCobranca,
}