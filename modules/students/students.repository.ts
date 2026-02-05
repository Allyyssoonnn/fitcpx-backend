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
         order: [["nome_aluno", "ASC"]],
      });
   }

   async findById(id: string, companyId?: string) {
      let where = companyId ? { cod_empresa: companyId } : {};
      return await db.tab_aluno.findOne({ where: { cod_aluno: id, ...where } });
   }

   async findByEmail(email: string) {
      return await db.tab_aluno.findOne({ where: { email_aluno: email } });
   }

   async findByCPF(cpf: string) {
      return await db.tab_aluno.findOne({ where: { cpf_aluno: cpf } });
   }

   async count(companyId: string) {
      return await db.tab_aluno.count({ where: { cod_empresa: companyId } });
   }

   async createOrUpdate(data: any) {
      return ((await db.tab_aluno.upsert(data)) as any)[0];
   }

   async update(data: any) {
      (await db.tab_aluno.update(data, { where: { cod_aluno: data.cod_aluno } })) as any;
      return await db.tab_aluno.findByPk(data.cod_aluno);
   }

   async deleteById(id: string) {
      return await db.tab_aluno.destroy({ where: { cod_aluno: id } });
   }

   async deleteAttenchmentById(id: string) {
      return await db.student_attachments.destroy({ where: { id } });
   }

   async findAttenchmentById(id: string) {
      return await db.student_attachments.findByPk(id);
   }

   async updateImageStudent(studentId: string, imageUrl: string) {
      return await db.tab_aluno.update({ imagem_aluno: imageUrl }, { where: { cod_aluno: studentId } });
   }

   async sendAttachments(data: any[]) {
      return await db.student_attachments.bulkCreate(data);
   }

   async updateApiId(studentId: string, apiId: string | null) {
      return await db.tab_aluno.update({ asaas_id: apiId }, { where: { cod_aluno: studentId } });
   }

   async findRefreshToken(refreshToken: string) {
      return await db.tab_refreshtoken_aluno.findOne({
         where: { refreshtoken_aluno: refreshToken },
      });
   }

   async deleteRefreshToken(refreshToken: string) {
      return await db.tab_refreshtoken_aluno.destroy({
         where: { refreshtoken_aluno: refreshToken },
      });
   }

   async saveDeviceTokenId(studentId: string, token: string, platform: string) {
      let exist = await db.device_tokens.findOne({ where: { token, studentId } });
      if (exist) return;
      return (await db.device_tokens.upsert({ studentId, token, platform }))[0];
   }

   async updatePassword(password: string, userId: string) {
      return await db.tab_aluno.update({ senha_aluno: password }, { where: { cod_aluno: userId } });
   }

   async findAllAttachments(studentId: string) {
      return db.student_attachments.findAll({
         where: { studentId },
         order: [["createdAt", "ASC"]],
      });
   }
}
