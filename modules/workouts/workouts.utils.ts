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
            // último elemento recebe o que sobrou
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
      const whereClause = {} as any;
      const { value: cod_grupo_exercicio } = grupo;

      whereClause[Op.or] = [{ cod_grupo_exercicio_1: { [Op.in]: [cod_grupo_exercicio] } }];

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
      });
      // Transformando em um array normal
      const exerciciosArray = exercicios.map((exercicio: any) => exercicio.toJSON());
      grupo.exercicios = exerciciosArray;

      for (let ii = 0; ii < divisaoExercicios[i]; ii++) {
         const exercicio = exerciciosArray[i];

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
            sequencia_sessao_exercicio: i + 1,
            repeticao_sessao_exercicio: repeticoes,
            intervalo_sessao_exercicio: intervalo,
         });
      }
   }

   return sessao;
}
