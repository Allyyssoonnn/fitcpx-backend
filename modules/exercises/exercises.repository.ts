import { Injectable } from "@nestjs/common";
import { Op, Sequelize } from "sequelize";
import db from "../../database/models";

@Injectable()
export class ExercisesRepository {
   async findAll(companyId: string | null, onlyDeleted: boolean = false, lang: string = "pt") {
      const where: any = onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {};
      where.cod_empresa = {
         [Op.or]: [companyId, null],
      };

      let nameExercicioColumn;
      let nameGrupoColumn;
      let nameJointColumn;
      let nameEquipmentColumn;
      let nameExerciseTypeColumn;
      let nameExerciseResistenceColumn;
      let nameSugestionColumn;
      switch (lang) {
         case "en":
            nameExercicioColumn = "nome_exercicio_en";
            nameGrupoColumn = "nome_grupo_exercicio_en";
            nameJointColumn = "nome_articulacao_en";
            nameEquipmentColumn = "nome_equipamento_en";
            nameExerciseTypeColumn = "nome_tipo_exercicio_en";
            nameExerciseResistenceColumn = "nome_exercicio_resistencia_en";
            nameSugestionColumn = "nome_indicacao_en";
            break;
         case "es":
            nameExercicioColumn = "nome_exercicio_es";
            nameGrupoColumn = "nome_grupo_exercicio_es";
            nameJointColumn = "nome_articulacao_es";
            nameEquipmentColumn = "nome_equipamento_es";
            nameExerciseTypeColumn = "nome_tipo_exercicio_es";
            nameExerciseResistenceColumn = "nome_exercicio_resistencia_es";
            nameSugestionColumn = "nome_indicacao_es";
            break;
         default: // 'pt' ou qualquer outro não especificado será o padrão
            nameExercicioColumn = "nome_exercicio";
            nameGrupoColumn = "nome_grupo_exercicio";
            nameJointColumn = "nome_articulacao";
            nameEquipmentColumn = "nome_equipamento";
            nameExerciseTypeColumn = "nome_tipo_exercicio";
            nameExerciseResistenceColumn = "nome_exercicio_resistencia";
            nameSugestionColumn = "nome_indicacao";
            break;
      }

      const muscleGroupInclude = Array.from({ length: 10 }, (_, i) => ({
         model: db.tab_grupo_exercicio,
         as: `grupo_exercicio_${i + 1}`,
         attributes: [
            [Sequelize.literal(`\`${`grupo_exercicio_${i + 1}`}\`.\`${nameGrupoColumn}\``), "nome_grupo_exercicio"],
         ],
      })) as any[];

      const jointInclude = Array.from({ length: 4 }, (_, i) => ({
         model: db.tab_articulacao,
         as: `articulacao_${i + 1}`,
         attributes: [[Sequelize.literal(`\`${`articulacao_${i + 1}`}\`.\`${nameJointColumn}\``), "nome_articulacao"]],
      })) as any[];

      const equipamentInclude = Array.from({ length: 3 }, (_, i) => ({
         model: db.tab_equipamento,
         as: `equipamento_${i + 1}`,
         attributes: [
            [Sequelize.literal(`\`${`equipamento_${i + 1}`}\`.\`${nameEquipmentColumn}\``), "nome_equipamento"],
         ],
      })) as any[];

      return db.tab_exercicio.findAll({
         paranoid: !onlyDeleted,
         where: where,
         include: [
            { model: db.tab_usuario, as: "usuario" },
            ...muscleGroupInclude,
            ...jointInclude,
            ...equipamentInclude,
            {
               model: db.tab_tipo_exercicio,
               as: "tipo_exercicio",
               attributes: [
                  [Sequelize.literal(`\`tipo_exercicio\`.\`${nameExerciseTypeColumn}\``), "nome_tipo_exercicio"],
               ],
            },
            {
               model: db.tab_exercicio_resistencia,
               as: "exercicio_resistencia",
               attributes: [
                  [
                     Sequelize.literal(`\`exercicio_resistencia\`.\`${nameExerciseResistenceColumn}\``),
                     "nome_exercicio_resistencia",
                  ],
               ],
            },
            {
               model: db.tab_indicacao,
               as: "indicacao",
               attributes: [[Sequelize.literal(`\`indicacao\`.\`${nameSugestionColumn}\``), "nome_indicacao"]],
            },
         ],
         order: [[Sequelize.literal(`${nameExercicioColumn}`), "ASC"]],
      });
   }

   async deleteById(id: string) {
      return await db.tab_exercicio.destroy({ where: { cod_exercicio: id } });
   }

   async createOrUpdate(data: any) {
      return await db.tab_exercicio.upsert(data);
   }
}
