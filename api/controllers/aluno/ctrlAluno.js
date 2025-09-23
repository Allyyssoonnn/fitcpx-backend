const { Sequelize } = require("sequelize");
const {
   tab_aluno,
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
const {
   calculaPorcentagemGordura,
   calculaPorcentagemMusculo,
   calculaPorcentagemMassaMagra,
   getResultPhysicalAssesment,
} = require("../ctrlAvaliacao");
const { default: puppeteer } = require("puppeteer");
const env = process.env.NODE_ENV || "development";

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

   const {
      modalidades,
      valor_plano,
      valor_adesao,
      contrato,
      duracao_plano,
      nome_plano,
      cod_aluno,
      cod_usuario,
      cod_empresa,
      parcela_plano,
      pagamentoInicial = new Date(),
   } = plano;

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
   recoveryAluno,
   getAvaliacoes,
   getAvaliacao,
   setAvaliacao,
   deleteAvaliacao,
   setAlunoContrato,
   getAlunoContratos,
   getAlunoContrato,
};
