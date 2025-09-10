const { Sequelize, Op } = require("sequelize");
const { tab_exercicio, tab_aluno, tab_avaliacao } = require("../../database/models");
const { getResultPhysicalFunc } = require("../controllers/ctrlAvaliacao");
const { calcularIdade, getReferenceWorkout } = require("../../utils");
const fs = require("fs");

function shuffleArray(arr) {
   for (let i = arr.length - 1; i > 0 - 1; i--) {
      const iRandom = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[iRandom]] = [arr[iRandom], arr[i]];
   }
   return arr;
}

async function generateTreino(req, res) {
   const { data } = req.body;

   function dividirComSobra(total, partes) {
      const resultado = [];
      const base = Math.ceil(total / partes);

      let acumulado = 0;
      for (let i = 0; i < partes; i++) {
         if (i === partes - 1) {
            // último elemento recebe o que sobrou
            resultado.push(total - acumulado);
         } else {
            resultado.push(base);
            acumulado += base;
         }
      }

      return resultado;
   }

   const {
      cod_aluno,
      gruposSelecionados,
      indicacoesSelecionadas,
      aquecimento,
      // equipamentosSelecionados,
      // desenvolvimento,
      // duracao,
      volume_treino,
      nivel_treino,
      desenvolvimento_treino,
   } = data;

   var sessao = [];

   const aluno = await tab_aluno.findByPk(cod_aluno);
   const avaliacao = (await tab_avaliacao.findAll({ where: { cod_aluno } }))[0];
   const referenceWorkout = getReferenceWorkout(nivel_treino, desenvolvimento_treino, volume_treino);
   const { repeticoes, series, intervalo, tempo, nExercicios } = referenceWorkout || {};
   const resultPhysical = avaliacao ? await getResultPhysicalFunc(aluno, avaliacao) : null;

   const qtdExercisesPerGroup = dividirComSobra(nExercicios, gruposSelecionados.length);

   const codIndicacoes = indicacoesSelecionadas.map((indicacao) => indicacao.cod_indicacao);
   // const codEquipamentos = equipamentosSelecionados.map(equipamento => equipamento.cod_equipamento);

   for (let i = 0; i < gruposSelecionados.length; i++) {
      const grupo = gruposSelecionados[i];
      const whereClause = {};
      const {
         value: cod_grupo_exercicio,
         cod_articulacao,
         cod_exercicio_resistencia,
         cod_padrao_movimento,
         cod_tipo_exercicio,
      } = grupo;

      whereClause.cod_grupo_exercicio_1 = cod_grupo_exercicio;

      //Filtrar assimetria
      //Havendo assimetria nessas regiões, optar por exercícios unilaterais para:
      // Braço / Braço Contraído: Latíssimo, Peitoral, Deltoide, Bíceps, Tríceps
      // Antebraço: Latíssimo, Deltoide, Bíceps, Tríceps, Antebraço
      // Coxa: Quadríceps, Isquiossurais
      // Panturrilha: Panturrilha

      //Filtro cenário

      // Outra limitação que tem que acontecer e futuramente dá para colocar como algo a ser preenchido é limitar a
      // parte do treino principal, apenas exercícios de força, posteriormente daria para colocar potência como algo selecionável,
      // mas só para rodar, dá para ser força. Eu tomei o cuidado para nas colunas que tinham duas valências como força e estabilidade,
      // quando eram exercício que serviam mais para estabilidade, ele ficasse na primeira coluna, e exercício de força comum,
      // a força estar no primeiro, assim tem como fazer um filtro mais fácil.

      const exercicios = await tab_exercicio.findAll({
         where: whereClause,
         attributes: ["cod_exercicio", "nome_exercicio"],
         distinct: true,
      });
      // Transformando em um array normal
      const exerciciosArray = exercicios.map((exercicio) => exercicio.toJSON());
      grupo.exercicios = shuffleArray(exerciciosArray);

      console.log(exercicios);

      for (let ii = 0; ii < qtdExercisesPerGroup[i]; ii++) {
         const exercicio = grupo.exercicios[ii];

         sessao.push({
            ...exercicio,
            cod_exercicio: exercicio.cod_exercicio,
            sets: [],
            // sets: exercise.sets.map((set) => ({
            //   id: set.id,
            //   repeticao_sessao_exercicio: repeticoes,
            //   intervalo_sessao_exercicio: intervalo,
            //   carga_sessao_exercicio: 0,
            //   serie_sessao_exercicio: series,
            // })),
            carga_sessao_exercicio: 0,
            serie_sessao_exercicio: series,
            repeticao_sessao_exercicio: repeticoes,
            intervalo_sessao_exercicio: intervalo,
         });
      }
   }

   res.send({ status: true, sessao });
}

module.exports = {
   generateTreino,
};
