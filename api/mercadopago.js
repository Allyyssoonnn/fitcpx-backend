const { tab_mercadopago_webhook, tab_pagamento_usuario } = require('../database/models');
const mercadopago = require('mercadopago');

const accessToken = '[REDACTED_CREDENTIAL]';
const mercadoPagoConfig = new mercadopago.MercadoPagoConfig({
    accessToken: accessToken
});

const paymentClient = new mercadopago.Payment(mercadoPagoConfig);
const preferenceClient = new mercadopago.Preference(mercadoPagoConfig);
const preapprovalClient = new mercadopago.PreApproval(mercadoPagoConfig);

const valor = 40.00;

const env = process.env.NODE_ENV || 'development';
const urlCallback = env == 'development' ? 'http://localhost:5173/licenca' : 'https://app.fitcpx.com/licenca';

async function getPreferenceId(name, email, recorrente) {
    try {
        if (recorrente) {
            // Pagamento Recorrente (Preapproval)
            const preapproval = {
                back_url: 'https://app.fitcpx.com/licenca',
                reason: "Fit Complex",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: valor,
                    currency_id: "BRL"
                },
                payer_email: email,
            };

            const response = await preapprovalClient.create({ body: preapproval });

            return { preferenceId: response.id, amount: valor, status: response.status };
        } else {
            // Pagamento Único (Preference)
            const preference = {
                items: [
                    {
                        title: 'Fit Complex',
                        unit_price: valor,
                        quantity: 1,
                        picture_url: 'https://fitcpx.com/assets/imagens/logo/logo.png' // Substitua pela URL da sua imagem
                    }
                ],
                payer: {
                    name: name,
                    email: email,
                },
                payment_methods: {
                    installments: 1,
                    excluded_payment_types: [
                        {
                            id: "ticket"
                        }
                    ],
                },
            }

            const response = await preferenceClient.create({ body: preference });
    
            return { preferenceId: response.id, amount: valor, status: response.status };
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function processPagamento(formData) {
    try {
        const response = await paymentClient.create({ body: formData });
        return response;
    } catch (error) {
        console.error(error);
        return;
    }
}

async function webhookPagamento(req, res) {
    const secretSing = '[REDACTED_CREDENTIAL]';
    
    try {
        const { action, type, data } = req.body;
        const bd = await tab_mercadopago_webhook.create({
            data_mercadopago_webhook: new Date(),
            json_mercadopago_webhook: JSON.stringify({ ...data, type, action }),
        });

        console.log("📩 Notificação recebida:", req.body);

        // Se a notificação for de um pagamento
        if (type === "payment") {
            const paymentId = data.id;
            const response = await paymentClient.get({ id: paymentId });
            const payment = response;
            await tab_mercadopago_webhook.update(
                { json2_mercadopago_webhook: JSON.stringify(response) },
                { where: { cod_mercadopago_webhook: bd.cod_mercadopago_webhook } }
            );
            await tab_pagamento_usuario.update(
                { status_pagamento_usuario: payment.status },
                { where: { paymentid_pagamento_usuario: paymentId } },
            )

            console.log("🛒 Pagamento recebido:", payment);

            // Processando diferentes status de pagamento
            if (payment.status === "approved") {
                console.log("✅ Pagamento aprovado!");
                // Aqui você pode atualizar o status do pedido no banco de dados
            } else if (payment.status === "pending") {
                console.log("⏳ Pagamento pendente.");
            } else if (payment.status === "rejected") {
                console.log("❌ Pagamento recusado.");
            }

            return res.sendStatus(200);
        }

        // Se a notificação for de um pedido (merchant_order)
        if (type === "merchant_order") {
            const orderId = data.id;
            console.log("📦 Atualização de pedido recebida:", orderId);
            return res.sendStatus(200);
        }

        // Se a notificação for de uma assinatura (subscription)
        if (type === "subscription_preapproval'") {
            console.log("🔄 Atualização de assinatura:", data);
            return res.sendStatus(200);
        }

        // Se a notificação for de uma fatura (invoice)
        if (type === "invoice") {
            console.log("📄 Atualização de fatura:", data);
            return res.sendStatus(200);
        }

        console.log("⚠️ Tipo de notificação não tratado:", req.body);
        return res.sendStatus(400); // Responde com erro se não reconhecer o evento

    } catch (error) {
        console.error("🚨 Erro no Webhook:", error);
        return res.sendStatus(500);
    }
}

module.exports = {
    getPreferenceId,
    processPagamento,
    webhookPagamento,
}