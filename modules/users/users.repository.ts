import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class UsersRepository {
   async findAll() {
      return await db.tab_usuario.findAll();
   }

   async findById(id: string, companyId?: string) {
      return await db.tab_usuario.findOne({ where: { cod_usuario: id, ...(companyId && { cod_empresa: companyId }) } });
   }

   async findByEmail(email: string) {
      return await db.tab_usuario.findOne({ where: { email_usuario: email.trim() } });
   }

   async createOrUpdate(data: any) {
      return await db.tab_usuario.upsert(data);
   }

   async updatePassword(password: string, userId: string) {
      return await db.tab_usuario.update({ senha_usuario: password }, { where: { cod_usuario: userId } });
   }
}
