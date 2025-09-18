import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class ServicesRepository {
   async findAll(companyId: string, onlyDeleted: boolean = false) {
      const where: any = onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {};
      if (companyId) where.cod_empresa = companyId;
      return db.tab_modalidade.findAll({
         paranoid: !onlyDeleted,
         where: where,
         include: [
            {
               model: db.tab_modalidade_variacao,
               as: "variacoes",
               include: [
                  {
                     model: db.tab_modalidade_variacao_valor,
                     as: "valores",
                  },
               ],
            },
         ],
      });
   }

   async createOrUpdate(data: any) {
      return (await db.tab_modalidade.upsert(data))[0];
   }

   async findById(serviceId: string) {
      return db.tab_modalidade.findByPk(serviceId);
   }

   async deleteById(serviceId: string) {
      return db.tab_modalidade.update({ deletedAt: new Date() }, { where: { cod_modalidade: serviceId } });
   }

   async recovery(serviceId: string) {
      await db.tab_modalidade.update({ deletedAt: null }, { where: { cod_modalidade: serviceId }, paranoid: false });
   }
}
