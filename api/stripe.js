const { formatarCelular } = require('../utils');
const env = process.env.NODE_ENV || 'development';

const urlBase = 'https://api.stripe.com';
const dev = env === 'development';
const token = env === 'development'
    ? process.env.STRYPE_KEY_DEVELOPMENT
    : process.env.STRIPE_KEY_PRODUCTION
;

const testBank = {
    object: 'bank_account',
    country: 'BR',
    currency: 'brl',
    account_number: '0001234',
    routing_number: '110-0000',
    account_holder_name: 'Nome da Academia Teste',
    account_holder_type: 'company',
}

// Exemplos válidos:
// 110-0001 (Banco do Brasil, agência 0001)
// 341-1234 (Itaú, agência 1234)
// 237-0123 (Bradesco, agência 0123)
// 104-2222 (Caixa Econômica Federal, agência 2222)

async function deleteAccount(id) {
    const respt = await stripe.account.del(empresa.dev_stripe_id);
    return respt;
}

async function createAccount(empresa, usuario, ip) {
    const stripe = require('stripe')(token);

    const account = await stripe.account.create({
        type: 'custom',
        country: 'BR',
        email: empresa.email_empresa,
        business_profile: {
            mcc: '7997',
            product_description: 'Atividados para saúde',
        },
        business_type: 'company',

        // Informações da empresa (obrigatórias para contas Custom)
        company: {
            name: empresa.nome_empresa,
            address: {
                line1: empresa.endereco_empresa,
                city: empresa.cidade_empresa,
                state: empresa.estado_empresa,
                postal_code: empresa.cep_empresa,
                country: 'BR'
            },
            phone: empresa.telefone_empresa,
            tax_id: empresa.doc_empresa, // CNPJ da empresa
            directors_provided: true,
            executives_provided: true,
            owners_provided: true,
        },
        // Dados bancários (obrigatórios para receber pagamentos)
        external_account: !dev ? {
            object: 'bank_account',
            country: 'BR',
            currency: 'brl',
            account_holder_name: empresa.titular_banco_conta,
            account_holder_type: 'company',
            routing_number: `${empresa.codigo_banco_conta}-${empresa.agencia_banco_conta}`, // Código do banco (3 dígitos)
            account_number: empresa.numero_banco_conta // Número da conta com dígito
        } : testBank,

        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
            boleto_payments: { requested: true },
        },
        tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: ip
        }
    });

    const dopDate = new Date(usuario.data_nascimento_usuario);

    var person;
    if (account.id) {
        person = await stripe.accounts.createPerson(account.id, {
            first_name: usuario.nome_usuario,
            last_name: usuario.nome_usuario,
            email: usuario.email_usuario,
            phone: formatarCelular(usuario.celular_usuario),
            id_number: usuario.cpf_usuario.replace(/[^0-9]/g, ''),
            political_exposure: 'none',
            dob: {
                day: dopDate.getDate(),
                month: dopDate.getMonth() + 1,
                year: dopDate.getFullYear(),
            },
            address: {
                line1: usuario.endereco_usuario,
                city: usuario.cidade_usuario,
                state: usuario.estado_usuario,
                postal_code: usuario.cep_usuario.replace(/[^0-9]/g, ''),
                country: 'BR'
            },
            relationship: {
                representative: true,
                title: 'CEO',
                owner: false,
                executive: true,
                director: false,
                percent_ownership: null,
            },
            nationality: 'BR',
        });
    }

    return { account, person };
}

async function updateAccount(empresa, accountId) {
    const stripe = require('stripe')(token);

    const account = await stripe.account.update({
        email: empresa.email_empresa,
        company: {
            name: empresa.nome_empresa,
            address: {
                line1: empresa.endereco_empresa,
                city: empresa.cidade_empresa,
                state: empresa.estado_empresa,
                postal_code: empresa.cep_empresa,
            },
            phone: empresa.telefone_empresa,
            tax_id: empresa.doc_empresa,
        },
    }, {
        stripeAccount: accountId,
    });

    return { account };
}

async function getStatusAccount(id) {
    const stripe = require('stripe')(token);
    
    const accountDetails = await stripe.accounts.retrieve(id);

    console.log(accountDetails.requirements);

    // Verificar se a conta está verificada e ativa
    // const isVerified = accountDetails.charges_enabled && accountDetails.payouts_enabled;
    // const verificationStatus = accountDetails.individual.verification.status;

    return accountDetails.requirements;
}

async function sendDocuments(id, personId, frontDoc, backDoc, frontDocType, backDocType) {
    const stripe = require('stripe')(token);
    
    const frontDocument = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: frontDoc,
            name: 'front',
            type: frontDocType,
        },
    });
    
    const backDocument = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: backDoc,
            name: 'back',
            type: backDocType,
        },
    });

    await stripe.accounts.updatePerson(
        id,
        personId,
        {
            verification: {
                document: {
                    front: frontDocument.id,
                    back: backDocument.id,
                },
            },
        }
    );

    return { frontDocumentId: frontDocument.id, backDocumentId: backDocument.id };
}

async function createCustomer(nome, email, documento, telefone, endereco, numero, cidade, estado, cep, cod, nome_empresa = null, accountId) {
    const stripe = require('stripe')(token);

    const customer = await stripe.customers.create({
        name: nome,
        email: email,
        phone: formatarCelular(telefone),
        address: {
            line1: endereco,
            line2: numero,
            city: cidade,
            state: estado,
            postal_code: cep,
            country: 'BR',
        },
    }, {
        stripeAccount: accountId, // ID da conta conectada
    });

    return customer.id;
}

async function updateCustomer(nome, email, documento, telefone, endereco, numero, cidade, estado, cep, nome_empresa = null, accountId, customerId) {
    const stripe = require('stripe')(token);

    const customer = await stripe.customers.update(customerId, {
        name: nome,
        email: email,
        phone: formatarCelular(telefone),
        address: {
            line1: endereco,
            line2: numero,
            city: cidade,
            state: estado,
            postal_code: cep,
            country: 'BR',
        },
    }, {
        stripeAccount: accountId,
    });

    return customer.id;
}

async function createInvoiceItem(accountId, customerId, name, price, invoiceId) {
    const stripe = require('stripe')(token);

    const invoiceItem = await stripe.invoiceItems.create({
        customer: customerId,
        invoice: invoiceId,
        amount: Math.round(price * 100), // em centavos
        currency: 'brl',
        description: name,
    }, {
        stripeAccount: accountId,
    });

    return invoiceItem.id;
}

async function createInvoice(accountId, paymentMethodId, dueDate) {
    const stripe = require('stripe')(token);
    var collection_method = paymentMethodId ? 'charge_automatically' : 'send_invoice';

    var invoiceSettings = {};
    if (collection_method == 'send_invoice') invoiceSettings = { days_until_due: 1 };

    const invoice = await stripe.invoices.create({
        customer: customerId,
        collection_method: collection_method,
        payment_settings: {
            payment_method_types: ['boleto', 'card'],
        },
        //Não finaliza a invoice antes do update
        auto_advance: false,
        ...invoiceSettings,
    }, {
        stripeAccount: accountId,
    });

    // await stripe.invoices.update(invoice.id, {
    //     due_date: Math.floor(new Date(dueDate).getTime() / 1000),
    // }, {
    //     stripeAccount: accountId,
    // });

    // await stripe.invoices.finalizeInvoice(invoice.id, {
    //     stripeAccount: accountId,
    // });

    return invoice;
}

async function finalizeInvoice(accountId, invoiceId) {
    const stripe = require('stripe')(token);

    await stripe.invoices.finalizeInvoice(invoiceId, {
        stripeAccount: accountId,
    });

    return;
}

async function setDefaultPaymentMethod(accountId, customerId, paymentMethodId) {
    const stripe = require('stripe')(token);
    
    const updated = await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
    }, {
        stripeAccount: accountId,
    });

    return updated;
}

//Pegar a intenção de cadastro do cartão para SubConta
async function getSetupIntent(accountId, customerId) {
    const stripe = require('stripe')(token);

    const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session',
        // on_behalf_of: accountId,
    }, {
        stripeAccount: accountId,
    });

    return setupIntent.client_secret;
}

async function getPaymentsMethod(accountId, customerId) {
    const stripe = require('stripe')(token);

    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
    }, {
        stripeAccount: accountId,
    });
    
    return paymentMethods.data;
}

async function createProduct(accountId, name) {
    const stripe = require('stripe')(token);

    const product = await stripe.products.create({
        name: name,
        description: name,
    }, {
        stripeAccount: accountId,
    });

    return product.id;
}

async function createPrice(accountId, productId, amount) {
    const stripe = require('stripe')(token);

    const amountInCents = amount * 100;

    const price = await stripe.prices.create({
        unit_amount: amountInCents,
        currency: 'brl',
        recurring: { interval: 'month' },
        product: productId,
    }, {
        stripeAccount: accountId,
    });

    return price.id;
}

async function createSubscriptionSchedule(accountId, customerId, paymentMethodId, items, duration, dueDate) {
    const stripe = require('stripe')(token);

    var collection_method = paymentMethodId ? 'charge_automatically' : 'send_invoice';

    const startDate = (dueDate && collection_method == 'send_invoice')
    ? Math.floor((new Date(dueDate) - 5 * 24 * 60 * 60 * 1000) / 1000)
    : 'now';

    var invoiceSettings = {};
    if (collection_method == 'send_invoice') invoiceSettings = { days_until_due: 1 };

    const schedule = await stripe.subscriptionSchedules.create({
        customer: customerId,
        start_date: 'now',
        end_behavior: 'release',
        phases: [{
            items: items,
            iterations: duration,
            collection_method: collection_method,
            invoice_settings: invoiceSettings
        }],
    }, {
        stripeAccount: accountId,
    });

    try {
        await createInvoicesSubscriptionSchedule(accountId, customerId, schedule.id);
    } catch (error) {
        return schedule;    
    }

    return schedule;
}

async function createInvoicesSubscriptionSchedule(accountId, customerId, subscriptionId) {
    const stripe = require('stripe')(token);

    // Após criar o schedule e obter o subscriptionId
    const invoice = await stripe.invoices.create({
        customer: customerId,
        subscription: subscriptionId,
    }, {
        stripeAccount: accountId,
    });
    
    // Opcional: finalize a fatura para forçar envio/pagamento
    await stripe.invoices.finalizeInvoice(invoice.id, {
        stripeAccount: accountId,
    });

    return;
}

async function cancelSubscriptionSchedule(accountId, subscriptionId) {
    const stripe = require('stripe')(token);

    const schedule = await stripe.subscriptionSchedules.cancel(subscriptionId, {
        stripeAccount: accountId,
    });

    return;
}

module.exports = {
    deleteAccount,
    createAccount,
    updateAccount,
    getStatusAccount,
    sendDocuments,
    createCustomer,
    updateCustomer,
    createInvoiceItem,
    setDefaultPaymentMethod,
    createInvoice,
    finalizeInvoice,
    getSetupIntent,
    getPaymentsMethod,
    createProduct,
    createPrice,
    createSubscriptionSchedule,
    createInvoicesSubscriptionSchedule,
    cancelSubscriptionSchedule,
}