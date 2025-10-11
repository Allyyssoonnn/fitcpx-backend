import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class PlansRepository {
   async findAll(companyId: string, onlyDeleted: boolean = false) {
      const where: any = onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {};
      if (companyId) where.cod_empresa = companyId;
      const plans = (await db.tab_plano.findAll({
         paranoid: !onlyDeleted,
         where: where,
         include: [
            {
               model: db.tab_plano_modalidade,
               as: "modalidades",
               include: [
                  {
                     model: db.tab_modalidade,
                     as: "modalidade",
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
                  },
               ],
            },
         ],
      })) as any;

      return plans.map((plan: any) => {
         const plainPlan = plan.get({ plain: true }); // remove referências do Sequelize
         plainPlan.modalidades = plainPlan.modalidades.map((mod: any) => ({
            ...mod.modalidade,
            ...mod,
         }));
         return plainPlan;
      });
   }

   async createOrUpdate(data: any, services: any) {
      let plan = (await db.tab_plano.upsert(data))[0] as any;
      const servicesDB = (await db.tab_plano_modalidade.findAll({ where: { cod_plano: plan.cod_plano } })) as [];
      const servicesDBIds = servicesDB.map((s: any) => s.cod_plano_modalidade);
      const servicesId = services.map((s: any) => s.cod_plano_modalidade);

      const servicesToDelete = servicesDBIds.filter((id) => !servicesId.includes(id)) as [];
      if (servicesToDelete.length) {
         await db.tab_plano_modalidade.destroy({
            where: { cod_plano: plan.cod_plano, cod_plano_modalidade: servicesToDelete },
         });
      }

      for (const service of services) {
         await db.tab_plano_modalidade.upsert({
            ...service,
            cod_plano: data?.cod_plano || plan.cod_plano,
            nome_plano_modalidade: service.nome_modalidade,
         });
      }

      return plan;
   }

   async findById(planId: string) {
      return db.tab_plano.findByPk(planId);
   }

   async deleteById(planId: string) {
      return db.tab_plano.update({ deletedAt: new Date() }, { where: { cod_plano: planId } });
   }

   async recovery(planId: string) {
      await db.tab_plano.update({ deletedAt: null }, { where: { cod_plano: planId }, paranoid: false });
   }
}
