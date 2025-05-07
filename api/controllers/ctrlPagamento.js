const moment = require("moment-timezone");
const { tab_usuario, tab_empresa, tab_aluno, tab_usuario_pagamento, tab_aluno_contrato_pagamento, tab_empresa_cartao, tab_aluno_cartao, tab_aluno_contrato, tab_aluno_contrato_modalidade, tab_modalidade_variacao, tab_modalidade_variacao_valor, tab_modalidade } = require('../../database/models');
const { buscarClienteIdUsuario, criarClienteUsuario, criarCobranca, cancelarCobranca, getPix, getTokenCard, criarCobrancaCartao, criarAssinatura, criarSubConta, buscarClienteId, criarCobrancaPIX, criarCliente, buscarSaldoSubConta, buscarExtratoSubConta, realizarSaque } = require('../asaas');
const { createAccount, getStatusAccount, sendDocuments, deleteAccount, setDefaultPaymentMethod, createInvoice, createInvoiceItem, createCustomer, getSetupIntent, getPaymentsMethod, finalizeInvoice, createProduct, createPrice, createSubscriptionSchedule } = require("../stripe");
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

    const empresaAtt = await tab_empresa.findOne({ where: { cod_empresa } });

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
    console.log(resp);

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
        
        if (!priceId) {
            priceId = await createPrice(accountId, productId, modalidade?.variacaoValor?.valor_modalidade_variacao_valor);
            var field = env === 'development' ? { dev_stripe_price_id: priceId } : { stripe_price_id: priceId };
            await tab_modalidade_variacao_valor.update(field, { where: { cod_modalidade_variacao_valor: modalidade?.variacaoValor?.cod_modalidade_variacao_valor } });
        } else {
            //Verificar se valor não foi alterado e cria uma preço só para essa assinatura
            const price = env === 'development' ? modalidade?.variacaoValor : modalidade?.variacaoValor;
            if (price.valor_modalidade_variacao_valor !== modalidade.valor_modalidade_alterado) {
                priceId = await createPrice(accountId, productId, modalidade.valor_modalidade_alterado);
            }
        }

        items.push({ price: priceId });
    }

    const subscriptionSchedule = await createSubscriptionSchedule(accountId, customerId, paymentId, items, duration, dataInicio);
    var field = env === 'development' ? { dev_stripe_id: subscriptionSchedule.id } : { stripe_id: subscriptionSchedule.id };
    await tab_aluno_contrato.update(field, { where: { cod_aluno_contrato } });

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

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
    customerId = env === 'development' ? aluno.dev_stripe_id : aluno.stripe_id;
    const paymentsMethod = await getPaymentsMethod(accountId, customerId);

    res.send({ status: true, paymentsMethod });
}

// =======================================================

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
        aluno.cpf_aluno,
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
    deletarConta,
    gerarIdCarteira,
    sendDocument,
    getStatusConta,
    criarPagamentoAluno,
    createCardToken,
    getPIXPagamentoAluno,
    getPIXPagamento,
    getPagamentos,
    deletePagamento,
    getCartoes,
    deleteCartao,
    getIntentCard,
    getCards,
}