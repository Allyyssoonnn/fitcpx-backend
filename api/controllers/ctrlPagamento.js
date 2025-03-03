const { getPreferenceId, processPagamento } = require("../mercadopago");
const { tab_empresa, tab_pagamento_usuario } = require('../../database/models');

async function getPagamento(req, res) {
    const { cod_usuario, cod_empresa, recorrente } = req.body;
    
    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });

    const pagamento = await getPreferenceId(empresa.nome_empresa, empresa.email_empresa, recorrente);

    if (pagamento) {
        // console.log(pagamento);
        // Envie pagamento para o frontend
    } else {
        // console.error("Erro ao gerar pagamento.");
        // Trate o erro
    }

    res.send({ status: true, pagamento });
}

async function donePagamento(req, res) {
    const { data, cod_empresa, cod_usuario, recorrente } = req.body;

    const pagamento = await processPagamento(data?.formData);

    tab_pagamento_usuario.create({
        cod_empresa,
        cod_usuario,
        data_pagamento_usuario: new Date(),
        valor_pagamento_usuario: data?.formData?.transaction_amount,
        forma_pagamento_usuario: data?.selectedPaymentMethod,
        documento_pagamento_usuario: data?.payer?.identification?.number,
        parcela_pagamento_usuario: data.formData?.installments,
        tipo_pagamento_usuario: recorrente ? 'Recorrência' : 'Pagamento único',
        ambiente_pagamento_usuario: process.env.NODE_ENV,
        paymentid_pagamento_usuario: pagamento?.id,
        status_pagamento_usuario: pagamento?.status,
        json_pagamento_usuario: JSON.stringify(pagamento),
    });

    res.send({ status: true });
}

module.exports = {
    getPagamento,
    donePagamento,
}