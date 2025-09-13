import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";
const { getResultPhysicalAssesment } = require("./physicalAssessments.utils");

@Injectable()
export class PhysicalAssessmentsRepository {
   async findAll(companyId: string, onlyDeleted: boolean = false, studentId?: string) {
      const physicals = await db.tab_avaliacao.findAll({
         paranoid: !onlyDeleted,
         where: onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {},
         include: [
            {
               model: db.tab_aluno,
               as: "aluno",
               required: true,
               where: studentId ? { cod_aluno: studentId } : {},
            },
            {
               model: db.tab_usuario,
               as: "usuario",
               required: true,
               where: companyId ? { cod_empresa: companyId } : {},
            },
            {
               model: db.tab_avaliacao_imagem,
               as: "imagem",
            },
         ],
      });

      const physicalsFlat = physicals.map((physicalAsse) => physicalAsse.toJSON());

      const physicalAssesmentsWithResult = await Promise.all(
         physicalsFlat.map(async (v) => ({
            ...v,
            nome_aluno: v.aluno?.nome_aluno,
            result: await getResultPhysicalAssesment({
               body: { avaliacao: v },
            }),
         }))
      );

      return physicalAssesmentsWithResult;
   }
}
