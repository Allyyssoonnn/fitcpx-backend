const moment = require("moment-timezone");
// const { tab_usuario_pagamento, tab_asaas_webhook } = require('../database/models');
const env = process.env.NODE_ENV || 'development';

const urlBase = env === 'development'
    ? 'https://api-sandbox.asaas.com/'
    : 'https://api.asaas.com/'
;

const token = env === 'development'
    ? process.env.ASAAS_KEY_DEVELOPMENT
    : "[REDACTED_CREDENTIAL]"
;

async function fetchJson(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro fetchJson:', error.message);
        throw error;
    }
}

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
            groupName: nome_empresa,
            notificationDisabled: true,
        })
    };
    
    const resp = await fetchJson(url, options);

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

    const response = await fetchJson(url, options);

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

    const resp = await fetchJson(url, options);

    return resp;
}

async function criarCobranca(customerId, cod, value, dueDate,
    tokenCartao, meuip, installments, billingType, name
) {
    const url = `${urlBase}/v3/payments/`;
    const body = {
        billingType, // 'CREDIT_CARD', 'PIX', 'BOLETO'
        customer: customerId,
        value: value,
        dueDate: moment(dueDate).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
        description: name || 'FitCpx',
        externalReference: cod,
        postalService: false,
        discount: { type: 'PERCENTAGE', value: 0 },
        interest: { value: 0 },
        fine: { value: 0, type: 'FIXED' },
    };

    if (billingType === 'CREDIT_CARD') {
        body.installmentCount = installments || 1;
        body.totalValue = value;
        // body.creditCardToken = tokenCartao;
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

    const resp = await fetchJson(url, options);

    return resp;
}

async function criarAssinatura(customerId, cod, value, dueDate, installments, billingType, name) {
    const url = `${urlBase}/v3/subscriptions`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
        body: JSON.stringify({
            billingType: billingType,
            cycle: 'MONTHLY',
            description: name || 'FitCpx',
            externalReference: cod,
            customer: customerId,
            value: value,
            nextDueDate: dueDate,
            maxPayments: installments,
        })
    };

    const resp = await fetchJson(url, options);
    return resp;
}

async function buscarCobranca(id) {
    try {
        const url = `${urlBase}/v3/payments/${id}`;
        const options = {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
        };
    
        const resp = await fetchJson(url, options);
    
        return resp;
    } catch (error) {
        return null;
    }
}

async function cobrancaRecebida(id) {
    const cobranca = await buscarCobranca(id);
    if (!cobranca) return;
    const url = `${urlBase}/v3/payments/${id}/receiveInCash`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
        body: JSON.stringify({
            paymentDate: new Date(),
            value: cobranca?.value,
        })
    };
    
    const resp = await fetchJson(url, options);
    return resp;
}

async function removerCobranca(id) {
    const cobranca = await buscarCobranca(id);
    if (!cobranca || cobranca?.status !== "PENDING") return;
    const url = `${urlBase}/v3/payments/${id}`;
    const options = {
        method: 'DELETE',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
    };
    
    const resp = await fetchJson(url, options);
    return resp;
}

module.exports = {
    criarCliente,
    atualizarCliente,
    getTokenCard,
    criarCobranca,
    buscarCobranca,
    cobrancaRecebida,
    criarAssinatura,
    removerCobranca,
}