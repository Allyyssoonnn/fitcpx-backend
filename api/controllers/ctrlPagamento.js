const moment = require("moment-timezone");
const { tab_usuario, tab_empresa, tab_aluno, tab_usuario_pagamento, tab_aluno_contrato_pagamento, tab_empresa_cartao, tab_aluno_cartao, tab_aluno_contrato, tab_aluno_contrato_modalidade, tab_modalidade_variacao, tab_modalidade_variacao_valor, tab_modalidade } = require('../../database/models');
const { createAccount, getStatusAccount, sendDocuments, deleteAccount, setDefaultPaymentMethod, createInvoice, createInvoiceItem, createCustomer, getSetupIntent, getPaymentsMethod, finalizeInvoice, createProduct, createPrice, createSubscriptionSchedule, getBalanceAccount, getExtract, doPayout } = require("../stripe");
const env = process.env.NODE_ENV || 'development';

async function deletarConta(req, res) {
    const { cod_empresa } = req.body;
    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });

    const accountId = env !== 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
    if (accountId) await deleteAccount(id);
    res.send({ status: true });
}

async function gerarIdCarteira(req, res) {
    const { cod_empresa, cod_usuario } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const usuario = await tab_usuario.findOne({ where: { cod_usuario } });
    const resp = await createAccount(empresa, usuario, req.ip);

    const { account, person } = resp;

    if (env !== 'development') {
        if (account.id) {
            await tab_empresa.update({
                stripe_id: account.id,
            }, { where: { cod_empresa } });
        }
        if (person.id) {
            await tab_usuario.update({
                stripe_id: person.id,
            }, { where: { cod_usuario } });
        }
    } else {
        if (account.id) {
            await tab_empresa.update({
                dev_stripe_id: account.id,
            }, { where: { cod_empresa } });
        }
        if (person.id) {
            await tab_usuario.update({
                dev_stripe_id: person.id,
            }, { where: { cod_usuario } });
        }
    }

    const empresaAtt = await tab_empresa.findOne({ where: { cod_empresa: cod_empresa.cod_empresa } });

    res.send({ status: true, empresa: empresaAtt });
}

async function sendDocument(req, res) {
    const { frontDoc, backDoc, cod_empresa, cod_usuario, frontDocType, backDocType } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const usuario = await tab_usuario.findOne({ where: { cod_usuario } });

    var id = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
    var personId = env === 'development' ? usuario.dev_stripe_id : usuario.stripe_id;

    const frontBuffer = Buffer.from(frontDoc.replace(/^data:.*;base64,/, ''), 'base64');
    const backBuffer = Buffer.from(backDoc.replace(/^data:.*;base64,/, ''), 'base64');

    const resp = await sendDocuments(id, personId, frontBuffer, backBuffer, frontDocType, backDocType);
    
    if (resp.frontDocumentId) {
        await tab_usuario.update({
            front_doc_id: resp.frontDocumentId,
        }, { where: { cod_usuario } });
    }

    if (resp.frontDocumentId) {
        await tab_usuario.update({
            back_doc_id: resp.frontDocumentId,
        }, { where: { cod_usuario } });
    }

    res.send({ status: true });
}

async function getStatusConta(req, res) {
    const { cod_empresa } = req.body;
    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    var resp;

    if (env === 'development') {
        if (empresa.dev_stripe_id) {
            resp = await getStatusAccount(empresa.dev_stripe_id);
        }
    } else {
        if (empresa.stripe_id) {
            resp = await getStatusAccount(empresa.stripe_id);
        }
    }

    res.send({ status: true, clientSecret: resp });
}

async function criarPagamentoAluno(req, res) {
    const { cod_aluno, cod_empresa, cod_usuario, cod_aluno_contrato, formaPagamento, mensal, paymentId } = req.body;
    var accountId;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    const aluno_contrato = await tab_aluno_contrato.findOne({
        include: [
            {
                model: tab_aluno_contrato_modalidade,
                as: 'modalidades',
                include: [
                    {
                        model: tab_modalidade_variacao,
                        as: 'variacao',
                    },
                    {
                        model: tab_modalidade_variacao_valor,
                        as: 'variacaoValor',
                    },
                    {
                        model: tab_modalidade,
                        as: 'modalidade',
                    },
                ],
            }
        ],
        where: { cod_aluno_contrato },
    });

    //If contract already pay
    if (formaPagamento === 'MANUAL') {
        res.send({ status: true });
        return;
    }

    accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
    customerId = env === 'development' ? aluno.dev_stripe_id : aluno.stripe_id;

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

    const dataInicio = new Date(aluno_contrato?.iniciopagamento_aluno_contrato);
    const resumoParcelas = JSON.parse(aluno_contrato?.parcela_aluno_contrato);
    const valor = mensal ? resumoParcelas[0] : aluno_contrato.total_aluno_contrato;
    const duration = resumoParcelas.length;

    if (formaPagamento === 'UNICA') {
        const invoice = await createInvoice(accountId, null, dataInicio);
        const invoiceItem = await createInvoiceItem(accountId, customerId, aluno_contrato.nome_aluno_contrato, aluno_contrato.total_aluno_contrato, invoice.id);
        await finalizeInvoice(accountId, invoice.id);

        var field = env === 'development' ? { dev_invoice_stripe_id: invoice.id } : { invoice_stripe_id: invoice.id };

        await tab_aluno_contrato.update({
            ...field,
            status_aluno_contrato: invoice?.status,
        }, { where: { cod_aluno_contrato } });

        res.send({ status: true });
        return;
    }

    if (formaPagamento === 'RECORRENTE' || formaPagamento === 'MENSAL') {
        var items = [];

        for (const modalidade of aluno_contrato?.modalidades) {
            var productId = env === 'development' ? modalidade?.variacao?.dev_stripe_product_id : modalidade?.variacao?.stripe_product_id;
            var priceId = env === 'development' ? modalidade?.variacaoValor?.dev_stripe_price_id : modalidade?.variacaoValor?.stripe_price_id;
    
            if (!productId) {
                var name = `${modalidade.modalidade.nome_modalidade} - ${modalidade.variacao.nome_modalidade_variacao}`;
                productId = await createProduct(accountId, name);
                var field = env === 'development' ? { dev_stripe_product_id: productId } : { stripe_product_id: productId };
                await tab_modalidade_variacao.update(field, { where: { cod_modalidade_variacao: modalidade?.variacao?.cod_modalidade_variacao } });
            }
            
            if (!priceId && modalidade?.variacaoValor) {
                priceId = await createPrice(accountId, productId, modalidade?.variacaoValor?.valor_modalidade_variacao_valor);
                var field = env === 'development' ? { dev_stripe_price_id: priceId } : { stripe_price_id: priceId };
                await tab_modalidade_variacao_valor.update(field, { where: { cod_modalidade_variacao_valor: modalidade?.variacaoValor?.cod_modalidade_variacao_valor } });
            } else {
                //Verificar se valor não foi alterado e cria uma preço só para essa assinatura
                const price = env === 'development' ? modalidade?.variacaoValor : modalidade?.variacaoValor;

                if (price) {
                    if (modalidade.valor_modalidade_alterado && price.valor_modalidade_variacao_valor !== modalidade.valor_modalidade_alterado) {
                        priceId = await createPrice(accountId, productId, modalidade.valor_modalidade_alterado);
                    }
                } else {
                    //Preenche com preço original
                    priceId = env === 'development' ? modalidade?.variacao?.dev_stripe_price_id : modalidade?.variacao?.stripe_price_id;
                    if (!priceId) {
                        priceId = await createPrice(accountId, productId, modalidade?.variacao?.valor_modalidade_variacao);
                        var field = env === 'development' ? { dev_stripe_price_id: priceId } : { stripe_price_id: priceId };
                        await tab_modalidade_variacao.update(field, { where: { cod_modalidade_variacao: modalidade?.variacao?.cod_modalidade_variacao } });
                    }
                }
            }
            
            items.push({ price: priceId });
        }
    
        const subscriptionSchedule = await createSubscriptionSchedule(accountId, customerId, paymentId, items, duration, dataInicio);
        var field = env === 'development' ? { dev_stripe_id: subscriptionSchedule.id } : { stripe_id: subscriptionSchedule.id };
        await tab_aluno_contrato.update({
            ...field,
            status_aluno_contrato: subscriptionSchedule?.status,
        }, { where: { cod_aluno_contrato } });

        res.send({ status: true });
        return;
    }

    res.send({ status: true });
}

async function getIntentCard(req, res) {
    const { cod_empresa, cod_aluno } = req.body;
    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
    customerId = env === 'development' ? aluno.dev_stripe_id : aluno.stripe_id;

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

    const clientSecret = await getSetupIntent(accountId, customerId);

    res.send({ status: true, clientSecret, accountId });
}

async function getCards(req, res) {
    const { cod_empresa, cod_aluno } = req.body;
    var paymentsMethod = [];

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
    customerId = env === 'development' ? aluno.dev_stripe_id : aluno.stripe_id;
    if (accountId && customerId) {
        paymentsMethod = await getPaymentsMethod(accountId, customerId);
    }

    res.send({ status: true, paymentsMethod });
}

async function getBalance(req, res) {
    const { cod_empresa } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;

    const balance = await getBalanceAccount(accountId);

    res.send({ status: true, balance });
}

async function getBankExtract(req, res) {
    const { cod_empresa, month, year } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;

    const bankExtract = await getExtract(accountId, month, year);

    res.send({ status: true, bankExtract });
}

async function cashWithdrawal(req, res) {
    const { cod_empresa } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;

    const payout = await doPayout(accountId);

    res.send({ status: true });
}

module.exports = {
    cashWithdrawal,
    getBankExtract,
    getBalance,
    deletarConta,
    gerarIdCarteira,
    sendDocument,
    getStatusConta,
    criarPagamentoAluno,
    getIntentCard,
    getCards,
}