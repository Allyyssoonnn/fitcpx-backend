import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class StudentsRepository {
   async findAll(companyId: string, onlyDeleted: boolean = false) {
      const where: any = onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {};
      if (companyId) where.cod_empresa = companyId;
      return db.tab_aluno.findAll({
         paranoid: !onlyDeleted,
         where: where,
      });
   }

   async findById(id: string, companyId: string) {
      return await db.tab_aluno.findOne({ where: { cod_aluno: id, cod_empresa: companyId } });
   }

   async createOrUpdate(data: any) {
      return await db.tab_aluno.upsert(data);
   }

   async deleteById(id: string) {
      return await db.tab_aluno.destroy({ where: { cod_aluno: id } });
   }

   async updateImageStudent(studentId: string, imageUrl: string) {
      return await db.tab_aluno.update({ imagem_aluno: imageUrl }, { where: { cod_aluno: studentId } });
   }
}
