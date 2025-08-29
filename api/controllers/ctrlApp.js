const { tab_licenca, tab_empresa_licenca, feedbacks, tab_empresa_licenca_pagamento } = require("../../database/models");

async function getNotifications(req, res) {
   const { cod_empresa } = req.body;
   var notifications = [];

   // ========================= Verifica faturas
   const payments = await tab_empresa_licenca_pagamento.findAll({
      include: [
         {
            model: tab_empresa_licenca,
            as: "empresaLicenca",
            where: { cod_empresa },
            include: [
               {
                  model: tab_licenca,
                  as: "licenca",
               },
            ],
         },
      ],
      where: { status_empresa_licenca_pagamento: "Pending" },
   });

   for (const payment of payments) {
      notifications.push({
         title: "Você tem uma fatura vencida",
         content: `Fatura ${payment.empresaLicenca?.licenca?.nome_licenca} ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
         }).format(payment.valor_empresa_licenca_pagamento)} aguardando pagamento`,
         type: "Licença",
         icon: "bi bi-cash",
         color: "danger",
      });
   }
   // ============================

   res.send({ status: true, notifications });
}

async function sendFeedback(req, res) {
   const { cod_empresa, type, message } = req.body;

   feedbacks.create({
      company_id: cod_empresa,
      type,
      message,
   });

   res.send({ status: true, message: "Feedback enviado com sucesso!" });
}

module.exports = {
   getNotifications,
   sendFeedback,
};
