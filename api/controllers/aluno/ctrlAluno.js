const { Sequelize } = require("sequelize");
const {
   tab_aluno,
   tab_aluno_contrato,
   tab_aluno_contrato_pagamento,
   tab_aluno_contrato_modalidade,
} = require("../../../database/models");
const moment = require("moment-timezone");
const { sendDocument, deleteDocument, downloadContract } = require("../../features/autentique");
const { removerCobranca, removerAssinaturaParcelamento } = require("../../utils/asaas");
const { default: puppeteer } = require("puppeteer");
const env = process.env.NODE_ENV || "development";

async function cancelAlunoContrato(req, res) {
   const { cod_aluno_contrato } = req.body;

   const alunoContrato = await tab_aluno_contrato.findOne({
      where: { cod_aluno_contrato },
   });
   if (alunoContrato?.autentique_aluno_contrato) await deleteDocument(alunoContrato.autentique_aluno_contrato);

   //Delete Subscription
   if (alunoContrato?.asaas_id) await removerAssinaturaParcelamento(alunoContrato?.asaas_id);

   //Delete all pending payments
   const payments = await tab_aluno_contrato_pagamento.findAll({
      where: { cod_aluno_contrato },
   });
   for (const payment of payments) {
      if (payment?.asaas_id) await removerCobranca(payment?.asaas_id);
   }

   await tab_aluno_contrato.update(
      { deletedAt: new Date(), status_aluno_contrato: "Cancelado" },
      { where: { cod_aluno_contrato } }
   );

   res.send({ status: true });
}

async function resendAlunoContrato(req, res) {
   const { cod_aluno_contrato } = req.body;
   const contratoPDF = req.file;

   const alunoContrato = await tab_aluno_contrato.findOne({
      where: { cod_aluno_contrato },
   });
   const aluno = await tab_aluno.findOne({
      where: { cod_aluno: alunoContrato.cod_aluno },
   });

   if (alunoContrato.autentique_aluno_contrato) {
      await deleteDocument(alunoContrato.autentique_aluno_contrato);
   }

   if (alunoContrato.arquivo_aluno_contrato) {
      const respAutentique = await sendDocument(contratoPDF, aluno.email_aluno);
      if (respAutentique)
         tab_aluno_contrato.update(
            {
               autentique_aluno_contrato: respAutentique,
               statusautentique_aluno_contrato: "Contrato enviado.",
            },
            { where: { cod_aluno_contrato } }
         );
      res.send({ status: true });
      return;
   }

   res.send({ status: true });
}

async function downloadAlunoContrato(req, res) {
   const { cod_aluno_contrato, signed } = req.body;
   const alunoContrato = await tab_aluno_contrato.findOne({
      where: { cod_aluno_contrato },
   });

   if (alunoContrato?.autentique_aluno_contrato) {
      const resp = await downloadContract(alunoContrato.autentique_aluno_contrato, signed);
      if (resp) {
         res.send({ status: true, url: resp });
      } else res.send({ status: false });
      return;
   }

   res.send({ status: true });
}

async function getAlunoContratos(req, res) {
   const { cod_aluno, cod_empresa } = req.body;

   var where = {};
   const ambienteAtual = process.env.NODE_ENV !== "production" ? "development" : "production";
   where = { ambiente_aluno_contrato: { [Sequelize.Op.eq]: ambienteAtual } };
   if (cod_aluno) where.cod_aluno = cod_aluno;
   if (cod_empresa) where.cod_empresa = cod_empresa;

   const alunoContratos = await tab_aluno_contrato.findAll({
      where: where,
      include: [
         {
            model: tab_aluno,
            as: "aluno",
         },
         {
            model: tab_aluno_contrato_pagamento,
            as: "pagamentos",
         },
      ],
   });

   res.send({ status: true, alunoContratos });
}

async function getAlunoContrato(req, res) {
   const { cod_aluno_contrato, cod_empresa } = req.body;

   var where = {};
   if (cod_aluno_contrato)
      where = {
         ...where,
         [Sequelize.Op.or]: [{ cod_aluno_contrato: cod_aluno_contrato }, { cod_aluno_contrato: null }],
      };

   const alunoContrato = await tab_aluno_contrato.findOne({
      where: where,
      include: [
         {
            model: tab_aluno_contrato_pagamento,
            as: "pagamentos",
            separate: true,
            order: [["expiracao_aluno_contrato_pagamento", "ASC"]],
         },
      ],
   });

   res.send({ status: true, alunoContrato });
}

module.exports = {
   cancelAlunoContrato,
   resendAlunoContrato,
   downloadAlunoContrato,
   getAlunoContratos,
   getAlunoContrato,
};
