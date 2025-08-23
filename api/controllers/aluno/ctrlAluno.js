const { Sequelize } = require("sequelize");
const {
   tab_aluno,
   tab_aluno_cartao,
   tab_avaliacao,
   tab_avaliacao_imagem,
   tab_usuario,
   tab_empresa,
   tab_aluno_contrato,
   tab_aluno_contrato_pagamento,
   tab_aluno_contrato_modalidade,
} = require("../../../database/models");
const { removeStringVazia, calcularIdadeDtAvaliacao } = require("../../../utils");
const moment = require("moment-timezone");
const { sendDocument, deleteDocument, downloadContract } = require("../../autentique");
const { calculaPorcentagemGordura, calculaPorcentagemMusculo, calculaPorcentagemMassaMagra, getResultPhysicalAssesment } = require("../ctrlAvaliacao");
const { getTokenCard, criarCliente, removerCobranca, removerAssinatura } = require("../../asaas");
const { default: puppeteer } = require("puppeteer");
const env = process.env.NODE_ENV || "development";
const dev = env === "development";

async function getAlunos(req, res) {
   const { cod_usuario, cod_empresa, deleted } = req.body;
   const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : { deletedAt: null };
   const alunos = await tab_aluno.findAll({
      where: where,
      paranoid: !deleted,
      include: [
         { model: tab_avaliacao, as: "avaliacao" },
         { model: tab_usuario, as: "usuario", where: { cod_empresa } },
      ],
      attributes: { exclude: ["senha_aluno"] },
      order: [["nome_aluno", "ASC"]],
   });
   res.send({ status: true, alunos });
}

async function getAluno(req, res) {
   const { cod_aluno } = req.body;
   const aluno = await tab_aluno.findOne({
      where: { cod_aluno: cod_aluno },
      include: [
         {
            model: tab_avaliacao,
            as: "avaliacao",
            include: [
               {
                  model: tab_avaliacao_imagem,
                  as: "imagem",
               },
            ],
         },
      ],
   });
   res.send({ status: true, aluno });
}

async function getCards(req, res) {
   const { cod_aluno } = req.body;

   const cards = await tab_aluno_cartao.findAll({
      where: { cod_aluno },
      attributes: { exclude: ["token_aluno_cartao"] },
   });
   res.send({ status: true, cards });
}

async function createCard(req, res) {
   const { formCard, cod_aluno } = req.body;

   const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
   const empresa = await tab_empresa.findOne({
      where: { cod_empresa: aluno.cod_empresa },
   });
   let asaasId = aluno.asaas_id;

   if (!asaasId) {
      asaasId = await criarCliente(
         aluno.nome_aluno,
         aluno.email_aluno,
         aluno.cpf_aluno,
         aluno.telefone_aluno,
         aluno.endereco_aluno,
         aluno.numero_aluno,
         aluno.estado_aluno,
         aluno.cep_aluno,
         aluno.cod_aluno,
         empresa.nome_empresa
      );
      await tab_aluno.update({ asaas_id: asaasId }, { where: { cod_aluno } });
   }

   let cardToken;
   if (formCard) {
      const { creditCardToken } = await getTokenCard(asaasId, {
         ...formCard,
         name: aluno.nome_aluno,
      });
      cardToken = creditCardToken;
   }

   if (cardToken)
      await tab_aluno_cartao.create({
         cod_aluno,
         final_aluno_cartao: formCard.number.slice(-4),
         expiracao_aluno_cartao: `${formCard.month}/${formCard.year}`,
         token_aluno_cartao: cardToken,
      });
   res.send({ status: true });
}

async function deleteCard(req, res) {
   const { cod_aluno_cartao } = req.body;

   await tab_aluno_cartao.update({ deletedAt: new Date() }, { where: { cod_aluno_cartao } });
   res.send({ status: true });
}

async function setAluno(req, res) {
   const { aluno } = req.body;
   var alunoAtt;

   if (aluno?.cod_aluno)
      alunoAtt = await tab_aluno.findOne({
         where: { cod_aluno: aluno.cod_aluno },
      });

   if (alunoAtt) {
      const { asaas_id, ...alunoSemAsaasId } = aluno;
      await tab_aluno.update(alunoSemAsaasId, {
         where: { cod_aluno: aluno.cod_aluno },
      });

      const empresa = await tab_empresa.findOne({
         where: { cod_empresa: aluno.cod_empresa },
      });
      const accountId = env === "development" ? empresa.dev_stripe_id : empresa.stripe_id;
      const customerId = env === "development" ? aluno.dev_stripe_id : aluno.stripe_id;
   } else {
      const novoAluno = await tab_aluno.create(aluno);
      alunoAtt = novoAluno;
   }
   res.send({ status: true, aluno: alunoAtt });
}

async function deleteAluno(req, res) {
   const { cod_aluno } = req.body;
   await tab_aluno.update({ deletedAt: new Date() }, { where: { cod_aluno: cod_aluno } });
   res.send({ status: true });
}

async function recoveryAluno(req, res) {
   const { cod_aluno } = req.body;
   await tab_aluno.update({ deletedAt: null }, { where: { cod_aluno: cod_aluno }, paranoid: false });
   res.send({ status: true });
}

async function getAvaliacoes(req, res) {
   const { cod_empresa, cod_aluno } = req.body;
   const whereEmpresa = cod_empresa ? { cod_empresa } : null;
   const whereAluno = cod_aluno ? { cod_aluno } : null;

   const avaliacoes = await tab_avaliacao.findAll({
      include: [
         {
            model: tab_aluno,
            as: "aluno",
            required: true,
            where: whereAluno,
         },
         {
            model: tab_usuario,
            as: "usuario",
            required: true,
            include: [
               {
                  model: tab_empresa,
                  as: "empresa",
                  required: true,
                  where: whereEmpresa,
               },
            ],
         },
         {
            model: tab_avaliacao_imagem,
            as: "imagem",
         },
      ],
   });
   const avaliacoesLimpa = avaliacoes.map((avaliacao) => avaliacao.toJSON());

   const physicalAssesments = await Promise.all(
      avaliacoesLimpa.map(async (v) => ({
         ...v,
         result: await getResultPhysicalAssesment({
            body: { avaliacao: v },
         }),
      }))
   );

   const avaliacoesFormatadas = physicalAssesments.map((av) => ({
      gordura: calculaPorcentagemGordura(
         {
            data_nascimento_aluno: av?.aluno?.data_nascimento_aluno,
            sexo_aluno: av?.aluno?.sexo_aluno,
         },
         av
      ),
      massa_muscular: calculaPorcentagemMusculo(
         {
            data_nascimento_aluno: av?.aluno?.data_nascimento_aluno,
            sexo_aluno: av?.aluno?.sexo_aluno,
         },
         av
      ),
      massa_magra: calculaPorcentagemMassaMagra(
         {
            data_nascimento_aluno: av?.aluno?.data_nascimento_aluno,
            sexo_aluno: av?.aluno?.sexo_aluno,
         },
         av
      ),
      idade: calcularIdadeDtAvaliacao(av?.aluno?.data_nascimento_aluno, av?.data_avaliacao),
      nome_aluno: av.aluno?.nome_aluno, // Primeiro atributo
      ...av, // Outros atributos
   }));
   res.send({ status: true, avaliacoes: avaliacoesFormatadas });
}

async function getAvaliacao(req, res) {
   const { cod_avaliacao } = req.body;
   const avaliacao = await tab_avaliacao.findOne({
      where: { cod_avaliacao: cod_avaliacao },
   });
   res.send({ status: true, avaliacao });
}

async function setAvaliacao(req, res) {
   const { avaliacao: avaliacaoReq } = req.body;
   var avaliacaoAtt;

   const avaliacao = removeStringVazia(avaliacaoReq);

   if (avaliacao.cod_avaliacao)
      avaliacaoAtt = await tab_avaliacao.findOne({
         where: { cod_aluno: avaliacao.cod_aluno },
      });

   if (avaliacaoAtt) {
      await tab_avaliacao.update(avaliacao, {
         where: { cod_avaliacao: avaliacao.cod_avaliacao },
      });
   } else {
      const novoAluno = await tab_avaliacao.create(avaliacao);
      avaliacaoAtt = novoAluno;
   }

   res.send({ status: true, avaliacao: avaliacaoAtt });
}

async function deleteAvaliacao(req, res) {
   const { cod_avaliacao } = req.body;
   await tab_avaliacao.update({ deletedAt: new Date() }, { where: { cod_avaliacao: cod_avaliacao } });
   res.send({ status: true });
}

async function setAlunoContrato(req, res) {
   const { plano } = req.body;

   const { modalidades, valor_plano, valor_adesao, contrato, duracao_plano, nome_plano, cod_aluno, cod_usuario, cod_empresa, parcela_plano, pagamentoInicial = new Date() } = plano;

   const alunoContrato = await tab_aluno_contrato.create({
      cod_aluno: cod_aluno,
      cod_usuario: cod_usuario,
      cod_empresa: cod_empresa,
      nome_aluno_contrato: nome_plano ?? `Contrato ${moment().format("DD/MM/YYYY")}`,
      iniciopagamento_aluno_contrato: pagamentoInicial,
      adesao_aluno_contrato: valor_adesao,
      parcela_aluno_contrato: parcela_plano,
      total_aluno_contrato: valor_plano,
      arquivo_aluno_contrato: contrato,
      duracao_aluno_contrato: duracao_plano,
      expiracao_aluno_contrato: moment().tz("America/Sao_Paulo").add(duracao_plano, "months").format("YYYY-MM-DD"),
      modalidades_aluno_contrato: JSON.stringify(modalidades),
      ambiente_aluno_contrato: env,
   });

   for (const modalidade of modalidades) {
      await tab_aluno_contrato_modalidade.create({
         cod_aluno_contrato: alunoContrato.cod_aluno_contrato,
         ...modalidade,
      });
   }

   res.send({ status: true, alunoContrato });
}

async function cancelAlunoContrato(req, res) {
   const { cod_aluno_contrato } = req.body;

   const alunoContrato = await tab_aluno_contrato.findOne({
      where: { cod_aluno_contrato },
   });
   if (alunoContrato?.autentique_aluno_contrato) await deleteDocument(alunoContrato.autentique_aluno_contrato);

   //Delete Subscription
   if (alunoContrato?.asaas_id) await removerAssinatura(alunoContrato?.asaas_id);

   //Delete all pending payments
   const payments = await tab_aluno_contrato_pagamento.findAll({
      where: { cod_aluno_contrato },
   });
   for (const payment of payments) {
      if (payment?.asaas_id) await removerCobranca(payment?.asaas_id);
   }

   await tab_aluno_contrato.update({ deletedAt: new Date(), status_aluno_contrato: "Cancelado" }, { where: { cod_aluno_contrato } });

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

async function sendAlunoContrato(req, res) {
   try {
      const { cod_aluno_contrato } = req.body;

      const alunoContrato = await tab_aluno_contrato.findOne({
         where: { cod_aluno_contrato },
      });
      const aluno = await tab_aluno.findOne({
         where: { cod_aluno: alunoContrato.cod_aluno },
      });

      if (alunoContrato.arquivo_aluno_contrato) {
         const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox"],
         });
         const page = await browser.newPage();
         await page.setContent(alunoContrato?.arquivo_aluno_contrato, {
            waitUntil: "networkidle0",
         });

         const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
               top: "40px",
               bottom: "40px",
               left: "40px",
               right: "40px",
            },
         });

         await browser.close();

         const respAutentique = await sendDocument(pdfBuffer, aluno.email_aluno);
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
   } catch (e) {
      console.log(e);
      res.send({ status: false });
   }
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
   getAlunos,
   getAluno,
   getCards,
   createCard,
   deleteCard,
   setAluno,
   deleteAluno,
   recoveryAluno,
   getAvaliacoes,
   getAvaliacao,
   setAvaliacao,
   deleteAvaliacao,
   setAlunoContrato,
   cancelAlunoContrato,
   sendAlunoContrato,
   resendAlunoContrato,
   downloadAlunoContrato,
   getAlunoContratos,
   getAlunoContrato,
};
