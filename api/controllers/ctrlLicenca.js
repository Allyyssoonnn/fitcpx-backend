const {
   tab_licenca,
   tab_empresa_licenca,
   tab_empresa,
   tab_empresa_licenca_pagamento,
} = require("../../database/models");
const env = process.env.NODE_ENV || "development";
const { criarCliente, criarCobranca, removerCobranca } = require("../utils/asaas");

async function getLicencas(req, res) {
   const licencas = await tab_licenca.findAll({
      where: { visivel_licenca: "S" },
   });
   res.send({ status: true, licencas });
}

async function getLicenca(req, res) {
   const { cod_empresa } = req.body;

   const licenca = await tab_empresa_licenca.findOne({
      include: [
         {
            model: tab_licenca,
            as: "licenca",
         },
      ],
      where: { cod_empresa, status_empresa_licenca: "Active" },
   });

   const licencaData = licenca?.get({ plain: true }) ?? {};
   const licencaResp = {
      ...licencaData,
      ...licencaData.licenca,
   };

   res.send({ status: true, licenca: licencaResp });
}

async function buyLicenca(req, res) {
   const { cod_empresa, cod_licenca, typePayment } = req.body;

   const empresa = await tab_empresa.findOne({ where: { cod_empresa } });
   const licenca = await tab_licenca.findOne({ where: { cod_licenca } });
   var asaas_id = empresa.asaas_id;

   if (!asaas_id) {
      asaas_id = await criarCliente(
         empresa.nome_empresa,
         empresa.email_empresa,
         empresa.doc_empresa,
         empresa.telefone_empresa,
         empresa.endereco_empresa,
         empresa.numero_empresa,
         empresa.estado_empresa,
         empresa.cep_empresa,
         empresa.cod_empresa,
         "Lab Complex Dev LTDA"
      );
      await tab_empresa.update({ asaas_id: asaas_id }, { where: { cod_empresa } });
   }

   await tab_empresa_licenca.update(
      {
         status_empresa_licenca: "Canceled",
      },
      { where: { status_empresa_licenca: "Active" } }
   );

   const empresa_licenca = await tab_empresa_licenca.create({
      status_empresa_licenca: "Active",
      cod_licenca,
      cod_empresa,
      ambiente_empresa_licenca: env,
      forma_empresa_licenca: null,
      tipopagamento_empresa_licenca: null,
   });

   const valor = licenca.valor_licenca;

   var billingType = "UNDEFINED";
   var dueDate = new Date();

   await criarCobranca(
      asaas_id,
      empresa_licenca.cod_empresa_licenca,
      valor,
      dueDate,
      null,
      null,
      null,
      billingType,
      "Use License"
   );

   res.send({ status: true });
   return;
}

async function cancelLicenca(req, res) {
   const { cod_empresa_licenca } = req.body;

   const licenca = await tab_empresa_licenca.findOne({
      where: { cod_empresa_licenca },
   });

   const payments = await tab_empresa_licenca_pagamento.findAll({
      include: [
         {
            model: tab_empresa_licenca,
            as: "empresaLicenca",
            where: { cod_empresa: licenca.cod_empresa },
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
      if (payment?.asaas_id) await removerCobranca(payment.asaas_id);
      await tab_empresa_licenca_pagamento.update(
         { status_empresa_licenca: "Canceled" },
         { where: { cod_empresa_licenca_pagamento: payment.cod_empresa_licenca_pagamento } }
      );
   }

   await tab_empresa_licenca.update({ status_empresa_licenca: "Canceled" }, { where: { cod_empresa_licenca } });

   res.send({ status: true });
}

async function getPayments(req, res) {
   const { cod_empresa } = req.body;

   const payments = await tab_empresa_licenca.findAll({
      include: [
         {
            model: tab_empresa_licenca_pagamento,
            as: "payments",
         },
         {
            model: tab_licenca,
            as: "licenca",
         },
      ],
      where: { cod_empresa },
      order: [["createdAt", "DESC"]],
   });

   res.send({ status: true, payments });
}

module.exports = {
   getLicencas,
   getLicenca,
   buyLicenca,
   cancelLicenca,
   getPayments,
};
