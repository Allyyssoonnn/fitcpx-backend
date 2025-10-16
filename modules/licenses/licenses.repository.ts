import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class LicensesRepository {
   async findAll() {
      return db.tab_licenca.findAll({ where: { visivel_licenca: "S" } });
   }

   async findById(licenseId: string) {
      return db.tab_licenca.findByPk(licenseId);
   }

   async deleteById(id: string) {
      return await db.tab_empresa_licenca.destroy({ where: { cod_empresa_licenca: id } });
   }
}
