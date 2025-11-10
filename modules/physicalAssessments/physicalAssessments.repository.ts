import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";
// const { getResultPhysicalAssesment } = require("./physicalAssessments.utils");
const { getResultPhysicalAssesment } = require("./physicalAssessments.funcs");

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
         order: [["data_avaliacao", "DESC"]],
      });

      const physicalsFlat = physicals.map((physicalAsse) => physicalAsse.toJSON());

      const physicalAssesmentsWithResult = (await Promise.all(
         physicalsFlat.map(async (v) => ({
            ...v,
            nome_aluno: v.aluno?.nome_aluno,
            result: await getResultPhysicalAssesment({
               body: { avaliacao: v },
            }),
         }))
      )) as any;

      return physicalAssesmentsWithResult;
   }

   async findById(studentId: string, physicalAssessmentId: string) {
      const physical = (await db.tab_avaliacao.findByPk(physicalAssessmentId, {
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
            },
            {
               model: db.tab_avaliacao_imagem,
               as: "imagem",
            },
         ],
      })) as any;

      const physicalFlat = physical.toJSON();

      const physicalAssesmentsWithResult = {
         ...physicalFlat,
         nome_aluno: physicalFlat.aluno?.nome_aluno,
         result: await getResultPhysicalAssesment({
            body: { avaliacao: physicalFlat },
         }),
      };

      return physicalAssesmentsWithResult;
   }

   async count(companyId: string) {
      return await db.tab_avaliacao.count({
         include: [
            {
               model: db.tab_usuario,
               as: "usuario",
               where: {
                  cod_empresa: companyId,
               },
            },
         ],
      });
   }

   async createOrUpdate(data: any) {
      return (await db.tab_avaliacao.upsert(data))[0];
   }

   async addImages(images: any[]) {
      return db.tab_avaliacao_imagem.bulkCreate(images);
   }

   async deleteById(id: string) {
      return await db.tab_avaliacao.destroy({ where: { cod_avaliacao: id } });
   }

   async deleteImage(url: string) {
      return db.tab_avaliacao_imagem.destroy({ where: { url_imagem: url } });
   }
}
