const moment = require("moment-timezone");
const { tab_pagamento_usuario } = require('../database/models');
const env = process.env.NODE_ENV || 'development';

const urlBase = env === 'development'
    ? 'https://api-sandbox.asaas.com/'
    : 'https://api.asaas.com/'
;

//token de teste conta alyson.personalstudio@gmail.com
//Não utilizada para recebimento
const token = env === 'development'
    ? process.env.ASAAS_KEY_PRODUCTION
    : '[REDACTED_CREDENTIAL]'
;

async function criarClienteUsuario(nome, email, documento, telefone, endereco, numero, estado, cep, cod_empresa, nome_empresa) {
    const url = `${urlBase}/v3/customers`;
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', access_token: token },
        body: JSON.stringify({
            name: nome,
            cpfCnpj: documento,
            email: email,
            phone: telefone,
            address: endereco,
            addressNumber: numero,
            province: estado,
            postalCode: cep,
            externalReference: cod_empresa,
            company: nome_empresa,
        })
    };
    
    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp.id;
}

async function buscarClienteIdUsuario(cod) {
    const url = `${urlBase}/v3/customers?externalReference=${cod}`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', access_token: token }
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp?.data[0]?.id || null;
}

async function buscarClienteUsuario(cod) {
    const url = `${urlBase}/v3/customers?customerId=${cod}`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', access_token: token }
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp?.data[0] || null;
}

async function criarCobranca(customerId, cod_empresa) {
    const url = `${urlBase}/v3/payments`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
        body: JSON.stringify({
            billingType: 'PIX',
            customer: customerId,
            value: 40,
            dueDate: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
            description: 'FitComplex',
            externalReference: cod_empresa,
            interest: {value: 0},
            fine: {value: null, type: 'FIXED'},
            postalService: false,
            callback: {successUrl: 'https://fitcpx.com', autoRedirect: false}
        })
    };
    
    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp;
}

async function criarCobrancaCartao(customerId, cod_empresa, tokenCartao, meuip) {
    const url = `${urlBase}/v3/payments/`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
        body: JSON.stringify({
            billingType: 'CREDIT_CARD',
            customer: customerId,
            value: 40,
            dueDate: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
            description: 'FitComplex',
            externalReference: cod_empresa,
            // installmentCount: 1,
            totalValue: null,
            // installmentValue: 40,
            discount: {type: 'PERCENTAGE'},
            interest: {value: 0},
            fine: {value: null, type: 'FIXED'},
            postalService: false,
            callback: {successUrl: 'https://fitcpx.com', autoRedirect: false},
            creditCardHolderInfo: {addressComplement: null, phone: null, mobilePhone: null},
            creditCardToken: tokenCartao,
            authorizeOnly: null,
            remoteIp: meuip,
        })
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp;
}

async function criarAssinatura(customerId, tokenCartao) {
    const url = `${urlBase}/v3/subscriptions/`;
    const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
    body: JSON.stringify({
        billingType: 'CREDIT_CARD',
        cycle: 'MONTHLY',
        customer: customerId,
        value: 40,
        nextDueDate: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
        discount: {value: 0, dueDateLimitDays: 0, type: 'PERCENTAGE'},
        interest: {value: 0},
        fine: {value: null, type: 'FIXED'},
        description: 'Assinatura Plano Fit Complex',
        endDate: null,
        maxPayments: null,
        externalReference: null,
        callback: {successUrl: 'https://fitcpx.com', autoRedirect: false},
        creditCardHolderInfo: {addressComplement: null, phone: null, mobilePhone: null},
        creditCardToken: tokenCartao,
        remoteIp: null
    })
    };
    
    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp;
}

async function getPix(cobrancaId) {
    const url = `${urlBase}/v3/payments/${cobrancaId}/pixQrCode`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', access_token: token }
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp.success ? resp : null;
}

async function cancelarCobranca(cobrancaId) {
    const url = `${urlBase}/v3/payments/${cobrancaId}`;
    const options = { method: 'DELETE', headers: { accept: 'application/json', access_token: token }};
    
    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp.deleted;
}

async function getTokenCard(customerId, cartao, ip) {
    const url = `${urlBase}/v3/creditCard/tokenizeCreditCard`;
    const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json', access_token: token },
    body: JSON.stringify({
        creditCard: {
            // number: '5031433215406351',
            number: cartao.cardNumber,
            expiryMonth: cartao.cardMonth,
            expiryYear: cartao.cardYear,
            ccv: cartao.cardCvv,
            holderName: cartao.cardName,
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

async function criarSubConta(nome, email, documento, cep, endereco, numero, bairro) {
    const url = `${urlBase}/v3/accounts`;
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({
            name: nome,
            email: email,
            loginEmail: email,
            cpfCnpj: documento,
            phone: null,
            mobilePhone: null,
            incomeValue: 5000,
            address: endereco,
            addressNumber: numero,
            complement: null,
            province: bairro,
            postalCode: cep,
            webhooks: [
                {
                    name: 'Fit Complex',
                    url: 'https://www.exemplo.com/webhook/asaas',
                    email: email,
                    enabled: true,
                    interrupted: false,
                    apiVersion: 3,
                    authToken: '5tLxsL6uoN',
                    sendType: 'SEQUENTIALLY',
                    events: ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED']
                }
            ]
        })
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    console.log(resp);

    return resp;
}

// =========================== WEBHOOK

async function webhookAsaas(req, res) {
    const { event, payment } = req.body;

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
        if (payment.id) {
            tab_pagamento_usuario.update({ status_pagamento_usuario: payment.status }, { where: { id_pagamento_usuario: payment.id } });
        }
    }

    if (event === 'PAYMENT_CREATED') {
        //Sai da função se não for assinatura
        if (!payment?.subscription) return;
        const cliente = await buscarClienteUsuario(payment.customerId);
        const empresa = await tab_empresa.findOne({ where: { cod_empresa: cliente.externalReference } });
        tab_pagamento_usuario.create({
            cod_empresa: empresa.cod_empresa,
            id_pagamento_usuario: payment.id,
            assinatura_pagamento_usuario: payment.subscription,
            json_pagamento_usuario: JSON.stringify(payment),
            status_pagamento_usuario: payment.status,
            valor_pagamento_usuario: payment.value,
            liquido_pagamento_usuario: payment?.netValue || payment.value,
            forma_pagamento_usuario: payment.billingType,
            data_pagamento_usuario: payment.dateCreated,
            expiracao_pagamento_usuario: moment(payment.dateCreated).add(30, 'days').format('YYYY-MM-DD'),
            parcela_pagamento_usuario: 1,
            tipo_pagamento_usuario: payment.subscription ? 'Recorrência' : 'Único',
            ambiente_pagamento_usuario: process.env.NODE_ENV,
        });
    }
    
    res.sendStatus(200);
}

module.exports = {
    criarClienteUsuario,
    buscarClienteIdUsuario,
    criarCobranca,
    criarCobrancaCartao,
    criarAssinatura,
    getPix,
    cancelarCobranca,
    getTokenCard,
    webhookAsaas,
    criarSubConta,
}