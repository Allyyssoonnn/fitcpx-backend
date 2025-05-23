const moment = require("moment-timezone");
const { tab_usuario, tab_empresa, tab_aluno, tab_empresa_licenca_pagamento, tab_aluno_contrato_pagamento, tab_empresa_licenca, tab_aluno_cartao, tab_aluno_contrato, tab_aluno_contrato_modalidade, tab_modalidade_variacao, tab_modalidade_variacao_valor, tab_modalidade } = require('../../database/models');
const { createAccount, getStatusAccount, sendDocuments, deleteAccount, setDefaultPaymentMethod, createCustomer, getSetupIntent, getPaymentsMethod, getBalanceAccount, getExtract, createPayment, getPaymentIntent, refundPayment, createAccountUser } = require("../stripe");
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

    const empresa = cod_empresa ? await tab_empresa.findOne({ where: { cod_empresa } }) : null;
    const usuario = await tab_usuario.findOne({ where: { cod_usuario } });
    const resp = cod_empresa ? await createAccount(empresa, usuario, req.ip) : await createAccountUser(usuario, req.ip);

    const { account, person } = resp;

    if (cod_empresa) {
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
    } else {
        if (env !== 'development') {
            if (account.id) {
                await tab_usuario.update({
                    stripe_account_id: account.id,
                }, { where: { cod_usuario } });
            }
        } else {
            if (account.id) {
                await tab_usuario.update({
                    dev_stripe_account_id: account.id,
                }, { where: { cod_usuario } });
            }
        }
    }

    const empresaAtt = cod_empresa ? await tab_empresa.findOne({ where: { cod_empresa: cod_empresa.cod_empresa } }) : null;
    const usuarioAtt = await tab_usuario.findOne({ where: { cod_usuario: cod_empresa.cod_usuario } });

    res.send({ status: true, empresa: empresaAtt, usuario: usuarioAtt });
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

    const dataInicio = new Date(aluno_contrato?.iniciopagamento_aluno_contrato);
    const resumoParcelas = JSON.parse(aluno_contrato?.parcela_aluno_contrato);
    const valor = formaPagamento === 'RECORRENTE' || formaPagamento === 'MENSAL' ? resumoParcelas[0] : aluno_contrato.total_aluno_contrato;
    const duration = resumoParcelas.length;

    //If contract already pay
    if (formaPagamento === 'MANUAL') {
        var name = '';

        for (const modalidade of aluno_contrato?.modalidades) {
            name = `${modalidade.modalidade.nome_modalidade} - ${modalidade.variacao.nome_modalidade_variacao}`;
        }

        await tab_aluno_contrato.update({
            status_aluno_contrato: 'Ativo',
            formapagamento_aluno_contrato: formaPagamento,
            descricao_aluno_contrato: name,
        }, { where: { cod_aluno_contrato } });

        for (let i = 0; i < resumoParcelas.length; i++) {
            const parcela = resumoParcelas[i];
            //Ignorar primeira parcela que já foi gerada
            if (i > 0) {
                await tab_aluno_contrato_pagamento.create({
                    cod_aluno_contrato: aluno_contrato.cod_aluno_contrato,
                    data_aluno_contrato_pagamento: moment(new Date()).add('month', i),
                    expiracao_aluno_contrato_pagamento: moment(new Date()).add('month', i),
                    valor_aluno_contrato_pagamento: parcela,
                    liquido_aluno_contrato_pagamento: parcela,
                    forma_aluno_contrato_pagamento: formaPagamento,
                    status_aluno_contrato_pagamento: 'Pendente',
                    ambiente_aluno_contrato_pagamento: env,
                }, { where: { cod_aluno_contrato } });
            }
        }

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

    if (formaPagamento === 'UNICA') {
        for (const modalidade of aluno_contrato?.modalidades) {
            name = `${modalidade.modalidade.nome_modalidade} - ${modalidade.variacao.nome_modalidade_variacao}`;
        }

        const payment = await createPayment(accountId, paymentId, valor, customerId, name);
        var field = env === 'development' ? { dev_stripe_payment_id: payment.id } : { stripe_payment_id: payment.id };
        await tab_aluno_contrato_pagamento.create({
            ...field,
            cod_aluno_contrato: aluno_contrato.cod_aluno_contrato,
            data_aluno_contrato_pagamento: new Date(),
            expiracao_aluno_contrato_pagamento: new Date(),
            valor_aluno_contrato_pagamento: valor,
            liquido_aluno_contrato_pagamento: valor,
            forma_aluno_contrato_pagamento: formaPagamento,
            status_aluno_contrato_pagamento: payment?.status,
            json_aluno_contrato_pagamento: JSON.stringify(payment),
            ambiente_aluno_contrato_pagamento: env,
        }, { where: { cod_aluno_contrato } });

        await tab_aluno_contrato.update({
            status_aluno_contrato: 'Ativo',
            descricao_aluno_contrato: name,
            formapagamento_aluno_contrato: formaPagamento,
        }, { where: { cod_aluno_contrato } });

        res.send({ status: true });
        return;
    }

    if (formaPagamento === 'RECORRENTE' && !paymentId) {
        res.send({ status: false, message: 'Opção recorrente selecionada sem um cartão informado!' });
        return;
    }

    if (formaPagamento === 'RECORRENTE' || formaPagamento === 'MENSAL') {
        var name = '';

        for (const modalidade of aluno_contrato?.modalidades) {
            name = `${modalidade.modalidade.nome_modalidade} - ${modalidade.variacao.nome_modalidade_variacao}`;
        }

        const payment = await createPayment(accountId, paymentId, valor, customerId, name);
        var field = env === 'development' ? { dev_stripe_payment_id: payment.id } : { stripe_payment_id: payment.id };
        await tab_aluno_contrato_pagamento.create({
            ...field,
            cod_aluno_contrato: aluno_contrato.cod_aluno_contrato,
            data_aluno_contrato_pagamento: new Date(),
            expiracao_aluno_contrato_pagamento: new Date(),
            valor_aluno_contrato_pagamento: valor,
            liquido_aluno_contrato_pagamento: valor,
            forma_aluno_contrato_pagamento: formaPagamento,
            status_aluno_contrato_pagamento: payment?.status,
            json_aluno_contrato_pagamento: JSON.stringify(payment),
            ambiente_aluno_contrato_pagamento: env,
        }, { where: { cod_aluno_contrato } });

        await tab_aluno_contrato.update({
            status_aluno_contrato: 'Ativo',
            descricao_aluno_contrato: name,
            formapagamento_aluno_contrato: formaPagamento,
        }, { where: { cod_aluno_contrato } });

        for (let i = 0; i < resumoParcelas.length; i++) {
            const parcela = resumoParcelas[i];
            //Ignorar primeira parcela que já foi gerada
            if (i > 0) {
                await tab_aluno_contrato_pagamento.create({
                    cod_aluno_contrato: aluno_contrato.cod_aluno_contrato,
                    data_aluno_contrato_pagamento: moment(new Date()).add('month', i),
                    expiracao_aluno_contrato_pagamento: moment(new Date()).add('month', i),
                    valor_aluno_contrato_pagamento: parcela,
                    liquido_aluno_contrato_pagamento: parcela,
                    forma_aluno_contrato_pagamento: formaPagamento,
                    status_aluno_contrato_pagamento: 'Pendente',
                    ambiente_aluno_contrato_pagamento: env,
                }, { where: { cod_aluno_contrato } });
            }
        }

        res.send({ status: true });
        return;
    }

    res.send({ status: true });
}

async function getIntentCard(req, res) {
    const { cod_empresa, cod_aluno, licenca } = req.body;
    
    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    var customerId;
    var accountId;

    if (licenca) {
        customerId = env === 'development' ? empresa.dev_stripe_customer_id : empresa.stripe_customer_id;
        
        if (!customerId) customerId = await createCustomer(
            empresa.nome_empresa,
            empresa.email_empresa,
            empresa.doc_empresa,
            empresa.telefone_empresa,
            empresa.endereco_empresa,
            empresa.numero_empresa,
            empresa.cidade_empresa,
            empresa.estado_empresa,
            empresa.cep_empresa,
            null
        );

        if (customerId) {
            var field = env === 'development' ? { dev_stripe_customer_id: customerId } : { stripe_customer_id: customerId };
            await tab_empresa.update(field, { where: { cod_empresa } });
        }
    } else {
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
            accountId
        );

        if (customerId) {
            var field = env === 'development' ? { dev_stripe_id: customerId } : { stripe_id: customerId };
            await tab_aluno.update(field, { where: { cod_aluno } });
        }
    }

    const clientSecret = await getSetupIntent(accountId, customerId);
    res.send({ status: true, clientSecret, accountId });
}

async function getIntentPayment(req, res) {
    const { cod_empresa, cod_aluno_contrato_pagamento, cod_empresa_licenca_pagamento } = req.body;
    var payment;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });

    if (cod_aluno_contrato_pagamento) {
        const pagamento = await tab_aluno_contrato_pagamento.findOne({ where: { cod_aluno_contrato_pagamento } });
        const accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
        const paymentIntentId = env === 'development' ? pagamento.dev_stripe_payment_id : pagamento.stripe_payment_id;
        payment = await getPaymentIntent(accountId, paymentIntentId);
    }

    if (cod_empresa_licenca_pagamento) {
        const pagamento = await tab_empresa_licenca_pagamento.findOne({ where: { cod_empresa_licenca_pagamento } });
        const paymentIntentId = env === 'development' ? pagamento.dev_stripe_payment_id : pagamento.stripe_payment_id;
        payment = await getPaymentIntent(null, paymentIntentId);
    }

    res.send({ status: true, payment });
}

async function updatePaymentIntentStatus(req, res) {
    const { paymentId, status, licenca, cobrarRecorrente } = req.body;

    const where = env === 'development' ? { dev_stripe_payment_id: paymentId } : { dev_stripe_payment_id: paymentId };

    if (licenca) {
        await tab_empresa_licenca_pagamento.update({
            status_empresa_licenca_pagamento: status,
        }, { where: where });

        if (cobrarRecorrente) {
            await tab_empresa_licenca.update({ status_empresa_licenca: 'RECORRENTE' },
                { where: where }
            )
        }
    } else {
        await tab_aluno_contrato_pagamento.update({
            status_aluno_contrato_pagamento: status,
        }, { where: where });

        if (cobrarRecorrente) {
            await tab_aluno_contrato.update({ status_aluno_contrato: 'RECORRENTE' },
                { where: where }
            )
        }
    }

    res.send({ status: true });
}

async function getCards(req, res) {
    const { cod_empresa, cod_aluno, licenca } = req.body;
    var paymentsMethod = [];
    
    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });

    if (licenca) {
        customerId = env === 'development' ? empresa.dev_stripe_customer_id : empresa.stripe_customer_id;
    
        if (customerId) {
            paymentsMethod = await getPaymentsMethod(null, customerId);
        }
    } else {
        const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
        accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
        customerId = env === 'development' ? aluno.dev_stripe_id : aluno.stripe_id;
    
        if (accountId && customerId) {
            paymentsMethod = await getPaymentsMethod(accountId, customerId);
        }
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

async function updateMethodPayment(req, res) {
    const { cod_empresa, cod_aluno, paymentId } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    const accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;
    const customerId = env === 'development' ? aluno.dev_stripe_id : aluno.stripe_id;

    if (paymentId) {
        await setDefaultPaymentMethod(accountId, customerId, paymentId);
        var field = env === 'development' ? { dev_payment_stripe_id: paymentId } : { payment_stripe_id: paymentId };
        await tab_aluno.update(field, { where: { cod_aluno } });
    }

    res.send({ status: true });
}

async function getBankExtract(req, res) {
    const { cod_empresa, month, year } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;

    const bankExtract = await getExtract(accountId, month, year);

    res.send({ status: true, bankExtract });
}

async function doRefundPayment(req, res) {
    const { cod_empresa, cod_aluno_contrato_pagamento } = req.body;

    const pagamento = await tab_aluno_contrato_pagamento.findOne({ where: { cod_aluno_contrato_pagamento } });

    const paymentId = env === 'development' ? pagamento.dev_stripe_payment_id : pagamento.stripe_payment_id;
    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
    const accountId = env === 'development' ? empresa.dev_stripe_id : empresa.stripe_id;

    const refund = await refundPayment(accountId, paymentId);

    if (refund.id) {
        await tab_aluno_contrato_pagamento.update(
            {
                status_aluno_contrato_pagamento: 'refund',
                dev_stripe_refund_id: refund.id,
            },
            { where: { cod_aluno_contrato_pagamento } }
        );
    }

    res.send({ status: true, refund });
}

module.exports = {
    getBankExtract,
    getBalance,
    updateMethodPayment,
    updatePaymentIntentStatus,
    deletarConta,
    gerarIdCarteira,
    sendDocument,
    getStatusConta,
    criarPagamentoAluno,
    getIntentCard,
    getIntentPayment,
    getCards,
    doRefundPayment,
}