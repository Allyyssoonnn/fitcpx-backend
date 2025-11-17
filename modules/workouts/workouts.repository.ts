import { Injectable } from "@nestjs/common";
import { Op, Sequelize } from "sequelize";
import db from "../../database/models";

@Injectable()
export class WorkoutsRepository {
   async findAll(companyId: string, onlyDeleted: boolean = false, studentId?: string) {
      const where: any = onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {};
      where.cod_empresa = {
         [Op.or]: [companyId, null],
      };
      if (studentId) {
         where.cod_aluno = studentId;
         where.status_treino = "A";
      } else where.cod_aluno = null;

      const workouts = await db.tab_treino.findAll({
         paranoid: !onlyDeleted,
         where: where,
         include: [
            {
               model: db.tab_usuario,
               as: "usuario",
            },
            {
               model: db.tab_sessao,
               as: "sessoes",
               include: [
                  {
                     model: db.tab_sessao_exercicio,
                     as: "exercicios",
                     include: [
                        {
                           model: db.tab_exercicio,
                           as: "exercicio",
                           include: [
                              {
                                 model: db.tab_exercicios_empresa,
                                 as: "exercicio_empresa",
                                 required: false,
                                 where: { cod_empresa: companyId },
                                 attributes: [],
                              },
                              {
                                 model: db.tab_grupo_exercicio,
                                 as: "grupo_exercicio_1",
                              },
                           ],
                           attributes: {
                              include: [
                                 [
                                    Sequelize.literal(
                                       `COALESCE(\`sessoes->exercicios->exercicio->exercicio_empresa\`.\`url_exercicio_empresa\`, \`sessoes->exercicios->exercicio\`.\`url_exercicio\`)`
                                    ),
                                    "url_exercicio",
                                 ],
                              ],
                           },
                        },
                     ],
                     order: [["sequencia_sessao_exercicio", "ASC"]],
                  },
               ],
               order: [["sequencia_sessao", "ASC"]],
            },
         ],
      });

      return workouts.map((workout) => {
         let workoutFlat = workout.toJSON();

         let sessionSorted = [...workoutFlat.sessoes].sort((a, b) => a.sequencia_sessao - b.sequencia_sessao);

         return {
            ...workoutFlat,
            qtd_sessoes: sessionSorted?.length ?? 0,
            sessoes: sessionSorted.map((session) => {
               const exercisesSorted = [...session.exercicios].sort(
                  (a, b) => a.sequencia_sessao_exercicios - b.sequencia_sessao_exercicios
               );

               const grouped = {} as any;

               exercisesSorted.forEach((exercise: any) => {
                  const sequencia = exercise.sequencia_sessao_exercicio as any;

                  if (!grouped[sequencia]) {
                     grouped[sequencia] = {
                        ...exercise.exercicio,
                        ...exercise,
                        sets: [],
                     };
                  } else {
                     grouped[sequencia].sets.push({
                        ...exercise.exercicio,
                        ...exercise,
                     });
                  }
               });

               return {
                  ...session,
                  exercicios: Object.values(grouped).map((exercise: any) => ({
                     ...exercise.exercicio,
                     ...exercise,
                     sets: exercise.sets || [],
                  })),
               };
            }),
         };
      });
   }

   async findOne(workoutId: string) {
      const workout = await db.tab_treino.findOne({
         where: { cod_treino: workoutId },
         include: [
            {
               model: db.tab_usuario,
               as: "usuario",
            },
            {
               model: db.tab_aluno,
               as: "aluno",
            },
            {
               model: db.tab_sessao,
               as: "sessoes",
               include: [
                  {
                     model: db.tab_sessao_exercicio,
                     as: "exercicios",
                     include: [
                        {
                           model: db.tab_exercicio,
                           as: "exercicio",
                           include: [
                              {
                                 model: db.tab_exercicios_empresa,
                                 as: "exercicio_empresa",
                                 required: false,
                                 attributes: [],
                              },
                              {
                                 model: db.tab_grupo_exercicio,
                                 as: "grupo_exercicio_1",
                              },
                           ],
                           attributes: {
                              include: [
                                 [
                                    Sequelize.literal(
                                       `COALESCE(\`sessoes->exercicios->exercicio->exercicio_empresa\`.\`url_exercicio_empresa\`, \`sessoes->exercicios->exercicio\`.\`url_exercicio\`)`
                                    ),
                                    "url_exercicio",
                                 ],
                              ],
                           },
                        },
                     ],
                     order: [["sequencia_sessao_exercicio", "ASC"]],
                  },
               ],
               order: [["sequencia_sessao", "ASC"]],
            },
         ],
      });

      if (!workout) return;

      let workoutFlat = workout.toJSON();

      let sessionSorted = [...workoutFlat.sessoes].sort((a, b) => a.sequencia_sessao - b.sequencia_sessao);

      return {
         ...workoutFlat,
         qtd_sessoes: sessionSorted?.length ?? 0,
         sessoes: sessionSorted.map((session) => {
            const exercisesSorted = [...session.exercicios].sort(
               (a, b) => a.sequencia_sessao_exercicios - b.sequencia_sessao_exercicios
            );

            const grouped = {} as any;

            exercisesSorted.forEach((exercise: any) => {
               const sequencia = exercise.sequencia_sessao_exercicio as any;

               if (!grouped[sequencia]) {
                  grouped[sequencia] = {
                     ...exercise.exercicio,
                     ...exercise,
                     sets: [],
                  };
               } else {
                  grouped[sequencia].sets.push({
                     ...exercise.exercicio,
                     ...exercise,
                  });
               }
            });

            return {
               ...session,
               exercicios: Object.values(grouped).map((exercise: any) => ({
                  ...exercise.exercicio,
                  ...exercise,
                  sets: exercise.sets || [],
               })),
            };
         }),
      };
   }

   async count(companyId: string) {
      return await db.tab_treino.count({ where: { cod_empresa: companyId } });
   }

   async deleteById(id: string) {
      return await db.tab_treino.destroy({ where: { cod_treino: id } });
   }

   async createOrUpdate(userId: string, companyId: string, workout: any, sessions?: any[]) {
      let workoutDB = (await db.tab_treino.upsert(workout))[0] as any;

      if (sessions) {
         for (const session of sessions) {
            const { exercicios } = session;
            let sessionDB = (
               await db.tab_sessao.upsert({
                  ...session,
                  cod_treino: workoutDB.cod_treino,
                  cod_empresa: companyId,
                  cod_usuario: userId,
               })
            )[0] as any;

            let exercisesId = [] as string[];
            exercicios.map((e: any) => {
               exercisesId.push(e.cod_sessao_exercicio);
               e?.sets.map((e: any) => exercisesId.push(e.cod_sessao_exercicio));
            });
            let exercisesDBId = (
               await db.tab_sessao_exercicio.findAll({ where: { cod_sessao: sessionDB.cod_sessao } })
            ).map((e: any) => e.cod_sessao_exercicio);
            let toRemove = exercisesDBId.filter((id) => !exercisesId.includes(id)) as [];
            await db.tab_sessao_exercicio.destroy({
               where: { cod_sessao: sessionDB.cod_sessao, cod_sessao_exercicio: toRemove },
            });

            for (const exercicio of exercicios) {
               await db.tab_sessao_exercicio.upsert({
                  ...exercicio,
                  cod_sessao: sessionDB.cod_sessao,
               });

               for (const set of exercicio?.sets) {
                  await db.tab_sessao_exercicio.upsert({
                     ...set,
                     cod_sessao: sessionDB.cod_sessao,
                  });
               }
            }
         }
      }

      return workoutDB;
   }

   async getJoints(lang: string = "pt") {
      const columnMap: Record<string, string> = {
         pt: "nome_articulacao",
         en: "nome_articulacao_en",
         es: "nome_articulacao_es",
      };

      const nameJointColumn = columnMap[lang] ?? columnMap["pt"];
      return db.tab_articulacao.findAll({
         attributes: ["cod_articulacao", [Sequelize.col(nameJointColumn), "nome_articulacao"]],
      });
   }

   async getEquipaments(lang: string = "pt") {
      const columnMap: Record<string, string> = {
         pt: "nome_equipamento",
         en: "nome_equipamento_en",
         es: "nome_equipamento_es",
      };

      const nameEquipamentColumn = columnMap[lang] ?? columnMap["pt"];
      return db.tab_equipamento.findAll({
         attributes: ["cod_equipamento", [Sequelize.col(nameEquipamentColumn), "nome_equipamento"]],
      });
   }

   async getMuscleGroups(lang: string = "pt") {
      const columnMap: Record<string, string> = {
         pt: "nome_grupo_exercicio",
         en: "nome_grupo_exercicio_en",
         es: "nome_grupo_exercicio_es",
      };

      const nameMuscleGroupColumn = columnMap[lang] ?? columnMap["pt"];
      return db.tab_grupo_exercicio.findAll({
         attributes: ["cod_grupo_exercicio", [Sequelize.col(nameMuscleGroupColumn), "nome_grupo_exercicio"]],
      });
   }

   async getSugestions(lang: string = "pt") {
      const columnMap: Record<string, string> = {
         pt: "nome_indicacao",
         en: "nome_indicacao_en",
         es: "nome_indicacao_es",
      };

      const nameSugestionColumn = columnMap[lang] ?? columnMap["pt"];
      return db.tab_indicacao.findAll({
         attributes: ["cod_indicacao", [Sequelize.col(nameSugestionColumn), "nome_indicacao"]],
      });
   }

   async getExerciseTypes(lang: string = "pt") {
      const columnMap: Record<string, string> = {
         pt: "nome_tipo_exercicio",
         en: "nome_tipo_exercicio_en",
         es: "nome_tipo_exercicio_es",
      };

      const nameExerciseTypeColumn = columnMap[lang] ?? columnMap["pt"];
      return db.tab_tipo_exercicio.findAll({
         attributes: ["cod_tipo_exercicio", [Sequelize.col(nameExerciseTypeColumn), "nome_tipo_exercicio"]],
      });
   }

   async getExerciseResistences(lang: string = "pt") {
      const columnMap: Record<string, string> = {
         pt: "nome_exercicio_resistencia",
         en: "nome_exercicio_resistencia_en",
         es: "nome_exercicio_resistencia_es",
      };

      const nameExerciseResistencesColumn = columnMap[lang] ?? columnMap["pt"];
      return db.tab_exercicio_resistencia.findAll({
         attributes: [
            "cod_exercicio_resistencia",
            [Sequelize.col(nameExerciseResistencesColumn), "nome_exercicio_resistencia"],
         ],
      });
   }

   async getMovementPatterns(lang: string = "pt") {
      const columnMap: Record<string, string> = {
         pt: "nome_padrao_movimento",
         en: "nome_padrao_movimento_en",
         es: "nome_padrao_movimento_es",
      };

      const nameMovementPatternsColumn = columnMap[lang] ?? columnMap["pt"];
      return db.tab_padrao_movimento.findAll({
         attributes: ["cod_padrao_movimento", [Sequelize.col(nameMovementPatternsColumn), "nome_padrao_movimento"]],
      });
   }

   async registerWorkoutStudent(session: any, time: string, studentId: string) {
      const treino_execucao = (await db.tab_treino_execucao.create({
         cod_treino: session.cod_treino,
         cod_sessao: session.cod_sessao,
         cod_aluno: session.cod_aluno ?? studentId,
         duracao_treino_execucao: time,
         data_treino_execucao: new Date(),
      })) as any;

      for (const exercicio of session.exercicios) {
         await db.tab_treino_execucao_exercicio.create({
            cod_treino_execucao: treino_execucao.cod_treino_execucao,
            cod_exercicio: exercicio?.cod_exercicio,
            treino_exercicio_executado:
               exercicio.feito != undefined
                  ? exercicio.feito
                     ? "S"
                     : "N"
                  : exercicio?.setsInfo?.every((set: any) => set.checked)
                  ? "S"
                  : "N",
            execucao_treino_execucao_exercicio: exercicio?.execucoes
               ? JSON.stringify(exercicio?.execucoes)
               : JSON.stringify(exercicio.setsInfo),

            sequencia_treino_execucao_exercicio: exercicio?.sequencia_sessao_exercicio,
            serie_treino_execucao_exercicio: exercicio?.serie_sessao_exercicio,
            repeticao_treino_execucao_exercicio: exercicio?.repeticao_sessao_exercicio,
            carga_treino_execucao_exercicio: exercicio?.carga_sessao_exercicio,
            observacao_treino_execucao_exercicio: exercicio?.observacao_sessao_exercicio ?? "",
            intervalo_treino_execucao_exercicio: exercicio?.intervalo_sessao_exercicio,
         });

         const exec = exercicio?.execucoes ?? exercicio.setsInfo;

         await db.tab_sessao_exercicio.update(
            {
               // serie_sessao_exercicio: exercicio?.serie_sessao_exercicio,
               repeticao_sessao_exercicio: exec[exec.length - 1]?.repetition ?? exercicio?.repeticao_sessao_exercicio,
               carga_sessao_exercicio: exec[exec.length - 1]?.weight ?? exercicio?.carga_sessao_exercicio,
               // intervalo_sessao_exercicio: exercicio?.intervalo_sessao_exercicio,
            },
            {
               where: { cod_sessao: session.cod_sessao, cod_exercicio: exercicio.cod_exercicio },
            }
         );

         for (const set of exercicio.sets) {
            const execSet = set?.execucoes ?? set.setsInfo;

            await db.tab_sessao_exercicio.update(
               {
                  // serie_sessao_exercicio: exercicio?.serie_sessao_exercicio,
                  repeticao_sessao_exercicio:
                     execSet[execSet.length - 1]?.repetition ?? set?.repeticao_sessao_exercicio,
                  carga_sessao_exercicio: execSet[execSet.length - 1]?.weight ?? set?.carga_sessao_exercicio,
                  // intervalo_sessao_exercicio: exercicio?.intervalo_sessao_exercicio,
               },
               {
                  where: { cod_sessao: session.cod_sessao, cod_exercicio: set.cod_exercicio },
               }
            );
         }
      }

      return;
   }
}
