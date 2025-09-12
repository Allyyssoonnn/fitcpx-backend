import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class UsersRepository {
   async findAll() {
      return await db.tab_usuario.findAll();
   }

   async findById(id: string, companyId: string) {
      return await db.tab_usuario.findOne({ where: { cod_usuario: id, cod_empresa: companyId } });
   }

   async findByEmail(email: string) {
      return await db.tab_usuario.findOne({ where: { email_usuario: email.trim() } });
   }

   async create(data: any) {
      return await db.tab_usuario.create(data);
   }
}
