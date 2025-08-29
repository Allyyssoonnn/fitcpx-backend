const {
   tab_licenca,
   tab_empresa_licenca,
   feedbacks,
   tab_empresa_licenca_pagamento,
   tab_aluno,
   tab_avaliacao,
   tab_treino,
   tab_usuario,
} = require("../../database/models");

async function getNotifications(req, res) {
   const { cod_empresa } = req.body;
   var notifications = [];

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

   res.send({ status: true, notifications });
}

// * Send feedback by user
async function sendFeedback(req, res) {
   const { cod_empresa, type, message } = req.body;

   // * Create feedback on database
   feedbacks.create({
      company_id: cod_empresa,
      type,
      message,
   });

   res.send({ status: true, message: "Feedback enviado com sucesso!" });
}

// * Get Dashboard data to home screen web
async function getDashboard(req, res) {
   const cod_empresa = req.cod_empresa;

   // * Count clients, users, physical Assessments and Workouts
   const clientsLength = await tab_aluno.count({ where: { cod_empresa, status_aluno: "A" } });
   const usersLength = await tab_usuario.count({ where: { cod_empresa } });
   const physicalAssessmentsLength = await tab_avaliacao.count({
      include: [{ model: tab_usuario, as: "usuario", where: { cod_empresa } }],
   });
   const workoutLength = await tab_treino.count({ where: { cod_empresa } });

   //Get last 5 physical assessments
   const lastPhysicalAssessments = await tab_avaliacao.findAll({
      include: [
         { model: tab_usuario, as: "usuario", where: { cod_empresa } },
         { model: tab_aluno, as: "aluno" },
      ],
      order: [["data_avaliacao", "DESC"]],
      limit: 5,
   });

   // * Create dashboard object
   const dashboard = {
      lengths: {
         clients: clientsLength,
         users: usersLength,
         physicalAssessments: physicalAssessmentsLength,
         workouts: workoutLength,
      },
      lastPhysicalAssessments,
   };

   res.send({ dashboard });
}

module.exports = {
   getNotifications,
   sendFeedback,
   getDashboard,
};
