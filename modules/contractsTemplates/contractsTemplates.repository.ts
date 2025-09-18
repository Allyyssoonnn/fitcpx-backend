import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class ContractsTemplatesRepository {
   async findAll(companyId: string, onlyDeleted: boolean = false) {
      const where: any = onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {};
      if (companyId) where.cod_empresa = companyId;
      return db.tab_contrato.findAll({
         paranoid: !onlyDeleted,
         where: where,
      });
   }

   async createOrUpdate(data: any) {
      return (await db.tab_plano.upsert(data))[0];
   }

   async findById(contractTemplateId: string) {
      return db.tab_contrato.findByPk(contractTemplateId);
   }

   async deleteById(contractTemplateId: string) {
      return db.tab_contrato.update({ deletedAt: new Date() }, { where: { cod_contrato: contractTemplateId } });
   }

   async recovery(contractTemplateId: string) {
      await db.tab_contrato.update(
         { deletedAt: null },
         { where: { cod_contrato: contractTemplateId }, paranoid: false }
      );
   }
}
