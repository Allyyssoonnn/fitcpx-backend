import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class UsersRepository {
   async findAll(companyId: string) {
      return await db.tab_usuario.findAll({
         where: { cod_empresa: companyId },
      });
   }

   async findById(id: string, companyId?: string) {
      return await db.tab_usuario.findOne({ where: { cod_usuario: id, ...(companyId && { cod_empresa: companyId }) } });
   }

   async findByEmail(email: string) {
      return await db.tab_usuario.findOne({ where: { email_usuario: email.trim() } });
   }

   async createOrUpdate(data: any) {
      return (await db.tab_usuario.upsert(data))[0];
   }

   async updatePassword(password: string, userId: string) {
      return await db.tab_usuario.update({ senha_usuario: password }, { where: { cod_usuario: userId } });
   }

   async updateImageUser(userId: string, imageUrl: string) {
      return await db.tab_usuario.update({ imagem_usuario: imageUrl }, { where: { cod_usuario: userId } });
   }

   async findRefreshToken(refreshToken: string) {
      return await db.tab_refreshtoken_usuario.findOne({
         where: { refreshtoken_usuario: refreshToken },
      });
   }

   async deleteRefreshToken(refreshToken: string) {
      return await db.tab_refreshtoken_usuario.destroy({
         where: { refreshtoken_usuario: refreshToken },
      });
   }

   async onError(userId: string, error: string, info: string) {
      return db.errors.create({ userId, error, info });
   }
}
