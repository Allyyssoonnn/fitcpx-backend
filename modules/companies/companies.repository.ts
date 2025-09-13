import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class CompaniesRepository {
   async findAll() {
      return await db.tab_empresa.findAll();
   }

   async findById(id: string) {
      return await db.tab_empresa.findByPk(id);
   }

   async findByEmail(email: string) {
      return await db.tab_empresa.findOne({ where: { email_empresa: email.trim() } });
   }

   async createOrUpdate(data: any) {
      return await db.tab_empresa.upsert(data);
   }
}
