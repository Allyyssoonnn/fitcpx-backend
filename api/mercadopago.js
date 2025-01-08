const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: '[REDACTED_CREDENTIAL]'
});

export async function processPayment() {
    try {
        const { formData } = req.body;
    
        // Criando a preferência para o pagamento
        const preference = {
          items: formData.items.map(item => ({
            title: item.title,
            unit_price: item.price,
            quantity: item.quantity,
          })),
          payer: {
            name: formData.payer.firstName + ' ' + formData.payer.lastName,
            email: formData.payer.email,
          },
          payment_methods: {
            installments: formData.installments,
            default_payment_method: formData.selectedPaymentMethod,
          },
        };
    
        const response = await mercadopago.preferences.create(preference);
    
        res.status(200).json({ preferenceId: response.body.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
}

export async function resultPayment() {
    try {
        const { paymentId } = req.body;
    
        const paymentResponse = await mercadopago.payment.get(paymentId);
    
        // Exemplo de resposta do MercadoPago
        const paymentResult = {
            status: paymentResponse.body.status,
            date_created: paymentResponse.body.date_created,
            transaction_amount: paymentResponse.body.transaction_amount,
            payer: paymentResponse.body.payer,
            payment_method: paymentResponse.body.payment_method,
            merchant_order_id: paymentResponse.body.merchant_order.id,
        };
    
        res.status(200).json(paymentResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter o resultado do pagamento' });
    }
}