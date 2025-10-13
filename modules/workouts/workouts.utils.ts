const { Op } = require("sequelize");
const { tab_exercicio } = require("../../database/models");
const { getReferenceWorkout } = require("../../utils");

export async function generateWorkoutTemplate(data: any) {
   function dividirComSobra(total: any, partes: any) {
      const resultado = [];
      const base = Math.ceil(total / partes);

      let acumulado = 0;
      for (let i = 0; i < partes; i++) {
         if (i === partes - 1) {
            resultado.push(total - acumulado);
         } else {
            resultado.push(base);
            acumulado += base;
         }
      }

      return resultado;
   }

   const { gruposSelecionados, volume_treino, nivel_treino, desenvolvimento_treino } = data;

   var sessao = [];

   const referenceWorkout = getReferenceWorkout(nivel_treino, desenvolvimento_treino, volume_treino);
   const { repeticoes, series, intervalo, tempo, nExercicios } = referenceWorkout || {};

   const divisaoExercicios = dividirComSobra(nExercicios, gruposSelecionados.length);

   for (let i = 0; i < gruposSelecionados.length; i++) {
      const grupo = gruposSelecionados[i];
      const { value: cod_grupo_exercicio } = grupo;

      const whereClause = {
         [Op.and]: [
            {
               [Op.or]: [{ cod_grupo_exercicio_1: cod_grupo_exercicio }],
            },
            { cod_tipo_exercicio: 5 },
         ],
      };

      const exercicios = await tab_exercicio.findAll({
         where: whereClause,
         attributes: ["cod_exercicio", "nome_exercicio", "cod_grupo_exercicio_1", "cod_tipo_exercicio"],
      });
      // Transformando em um array normal
      const exerciciosArray = exercicios.map((exercicio: any) => exercicio.toJSON());
      grupo.exercicios = exerciciosArray;

      const shuffled = exerciciosArray.sort(() => 0.5 - Math.random());
      for (let ii = 0; ii < divisaoExercicios[i]; ii++) {
         const exercicio = shuffled[ii % shuffled.length];
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
            sequencia_sessao_exercicio: ii + 1,
            repeticao_sessao_exercicio: repeticoes,
            intervalo_sessao_exercicio: intervalo,
         });
      }
   }

   return sessao;
}
