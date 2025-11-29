import { Injectable } from "@nestjs/common";
import { Op, Sequelize } from "sequelize";
import db from "../../database/models";

@Injectable()
export class LicensesRepository {
   async findAll(daysAfterCompanyCreated: number, coupon?: string, dueCoupon?: string) {
      const results = await db.tab_licenca.findAll({
         attributes: {
            include: [[Sequelize.literal(`daysleft_register_licenca - ${daysAfterCompanyCreated}`), "daysLeft"]],
         },
         where: {
            [Op.and]: [
               // due_licenca não venceu OU é null
               {
                  [Op.or]: [{ due_licenca: { [Op.gte]: Sequelize.fn("NOW") } }, { due_licenca: null }],
               },
               {
                  [Op.or]: [
                     { visivel_licenca: "S" },
                     { daysleft_register_licenca: { [Op.gte]: daysAfterCompanyCreated } },
                     coupon ? { cupom_licenca: coupon } : {},
                  ],
               },
            ],
         },
         raw: true,
         order: [["cod_licenca", "DESC"]],
      });

      if (coupon && dueCoupon) {
         return results.map((item: any) => ({
            ...item,
            dueCoupon: item.cupom_licenca === coupon ? dueCoupon : null,
         }));
      }

      return results;
   }

   async findById(licenseId: string) {
      return db.tab_licenca.findByPk(licenseId);
   }

   async findByCoupon(coupon: string) {
      return db.tab_licenca.findOne({ where: { cupom_licenca: coupon } });
   }

   async deleteById(id: string) {
      return await db.tab_empresa_licenca.destroy({ where: { cod_empresa_licenca: id } });
   }
}
