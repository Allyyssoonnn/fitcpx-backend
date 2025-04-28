const moment = require("moment-timezone");
const { tab_usuario_pagamento, tab_asaas_webhook } = require('../database/models');
const env = process.env.NODE_ENV || 'development';

const urlBase = env === 'development'
    ? 'https://api-sandbox.asaas.com/'
    : 'https://api.asaas.com/'
;

//token de teste conta alyson.personalstudio@gmail.com
//Não utilizada para recebimento
const token = env === 'development'
    ? '[REDACTED_CREDENTIAL]'
    : process.env.ASAAS_KEY_PRODUCTION
;

async function criarSubConta(empresa) {
    const url = `${urlBase}/v3/accounts`;
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', access_token: token},
        body: JSON.stringify({
            name: empresa.nome_empresa,
            email: empresa.email_empresa,
            loginEmail: empresa.email_empresa,
            cpfCnpj: empresa.doc_empresa.replace(/[^\d]+/g, ''),
            companyType: 'LIMITED',
            // MEI, LIMITED, INDIVIDUAL, ASSOCIATION
            mobilePhone: empresa.telefone_empresa,
            incomeValue: 5000,
            address: empresa.endereco_empresa,
            addressNumber: empresa.numero_empresa,
            province: empresa.cidade_empresa,
            postalCode: empresa.cep_empresa.replace(/[^\d]+/g, ''),
            site: 'https://fitcpx.com',
            webhooks: [
                {
                    name: `WebHook - ${empresa.nome_empresa}`,
                    url: 'https://webhook.fitcpx.com/webhook',
                    email: empresa.email_empresa,
                    enabled: true,
                    interrupted: false,
                    apiVersion: 3,
                    sendType: 'SEQUENTIALLY',
                    events: ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED']
                }
            ]
        })
    };

    try {
        const response = await fetch(url, options);
        const resp = await response.json();

        return resp;
    } catch (err) {
        console.error('Erro ao criar subconta:', err);
        return { status: false, message: err.message };
    }
}

async function buscarClienteId(cod, apikey) {
    const url = `${urlBase}/v3/customers?externalReference=${cod}`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', access_token: apikey ?? token }
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp?.data[0]?.id || null;
}

async function criarCliente(nome, email, documento, telefone, endereco, numero, estado, cep, cod, nome_empresa = null, apikey) {
    const url = `${urlBase}/v3/customers`;
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', access_token: apikey ?? token },
        body: JSON.stringify({
            name: nome,
            cpfCnpj: documento.replace(/[^\d]+/g, ''),
            email: email,
            phone: telefone,
            address: endereco,
            addressNumber: numero,
            province: estado,
            postalCode: cep,
            externalReference: cod,
            company: nome_empresa,
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

async function atualizarSubConta(empresa, apikey) {
    const url = `${urlBase}/v3/myAccount/commercialInfo/`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: apikey ?? token },
        body: JSON.stringify({
            name: empresa.nome_empresa,
            email: empresa.email_empresa,
            loginEmail: empresa.email_empresa,
            cpfCnpj: empresa.doc_empresa.replace(/[^\d]+/g, ''),
            personType: 'JURIDICA',
            companyType: 'LIMITED',
            // MEI, LIMITED, INDIVIDUAL, ASSOCIATION
            mobilePhone: empresa.telefone_empresa,
            incomeValue: 5000,
            address: empresa.endereco_empresa,
            addressNumber: empresa.numero_empresa,
            province: empresa.cidade_empresa,
            postalCode: empresa.cep_empresa.replace(/[^\d]+/g, ''),
            site: 'https://fitcpx.com',
        })
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return;
}

async function getTokenCard(customerId, cartao, ip, apikey) {
    const url = `${urlBase}/v3/creditCard/tokenizeCreditCard`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: apikey ?? token },
        body: JSON.stringify({
            creditCard: {
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

async function criarCobrancaPIX(customerId, cod, value, apikey, dueDate) {
    const url = `${urlBase}/v3/payments`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: apikey ?? token },
        body: JSON.stringify({
            billingType: 'PIX',
            customer: customerId,
            value: value,
            dueDate: moment(dueDate).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
            description: 'FitComplex',
            externalReference: cod,
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

async function criarCobrancaCartao(customerId, cod, value, dueDate, tokenCartao, meuip, apikey) {
    const url = `${urlBase}/v3/payments/`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: apikey ?? token },
        body: JSON.stringify({
            billingType: tokenCartao ? 'CREDIT_CARD' : 'UNDEFINED',
            customer: customerId,
            value: value,
            dueDate: moment(dueDate).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
            description: 'FitCpx',
            externalReference: cod,
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

async function criarAssinatura(customerId, tokenCartao, cod, value, initialPay, duration, name, apikey) {
    const url = `${urlBase}/v3/subscriptions/`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: apikey ?? token },
        body: JSON.stringify({
            billingType: tokenCartao ? 'CREDIT_CARD' : 'UNDEFINED',
            cycle: 'MONTHLY',
            customer: customerId,
            value: value,
            nextDueDate: moment(initialPay).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
            discount: {value: 0, dueDateLimitDays: 0, type: 'PERCENTAGE'},
            interest: {value: 0},
            fine: {value: null, type: 'FIXED'},
            description: name,
            endDate: null,
            maxPayments: duration,
            installmentCount: 1,
            externalReference: cod,
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

async function cancelarAssinatura(subscriptionId, apikey) {
    const url = `${urlBase}/v3/subscriptions/${subscriptionId}`;
    const options = {method: 'DELETE', headers: { accept: 'application/json', access_token: apikey ?? token }};

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp;
}

async function buscarPagamentosAssinatura(subscriptionId, apikey) {
    const url = `${urlBase}/v3/payments?subscription=${subscriptionId}`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', access_token: apikey ?? token }
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp?.data ?? [];
}

async function buscarSaldoSubConta(apikey) {
    const url = `${urlBase}/v3/finance/balance`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', access_token: apikey ?? token }
    };

    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp?.balance ?? 0;
}

async function buscarExtratoSubConta(apikey, month, year) {
    const startDate = new Date(year, month - 1, 1); // Primeiro dia do mês
    const endDate = new Date(year, month, 0); // Último dia do mês (dia 0 do mês seguinte)
    const start = startDate.toISOString().split('T')[0]; // yyyy-mm-dd
    const end = endDate.toISOString().split('T')[0];

    const url = `${urlBase}/v3/financialTransactions?limit=100&startDate=${start}&finishDate=${end}`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', access_token: apikey ?? token }
    };
    
    const response = await fetch(url, options)
    .catch(err => console.error(err));
    const resp = await response.json();

    return resp?.data ?? 0;
}

async function realizarSaque(apikey, chave, tipoChave, valor) {
    const url = `${urlBase}/v3/transfers`;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', access_token: apikey ?? token },
        body: JSON.stringify({
            value: valor,
            operationType: 'PIX',
            pixAddressKey: chave.replace(/[^\d]+/g, ''),
            description: `SAQUE - ${moment(new Date()).tz('America/Sao_Paulo').format('YYYY-MM-DD')}`,
            pixAddressKeyType: tipoChave,
        })
    };

    fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
}

// =======================

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
            // description: '',
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

async function getPix(cobrancaId, apikey) {
    const url = `${urlBase}/v3/payments/${cobrancaId}/pixQrCode`;
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', access_token: apikey ?? token }
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

module.exports = {
    realizarSaque,
    criarSubConta,
    buscarClienteId,
    criarCliente,
    atualizarCliente,
    atualizarSubConta,
    getTokenCard,
    criarCobrancaPIX,
    criarClienteUsuario,
    buscarClienteIdUsuario,
    criarCobranca,
    criarCobrancaCartao,
    criarAssinatura,
    cancelarAssinatura,
    getPix,
    buscarSaldoSubConta,
    buscarExtratoSubConta,
    cancelarCobranca,
    buscarPagamentosAssinatura,
}