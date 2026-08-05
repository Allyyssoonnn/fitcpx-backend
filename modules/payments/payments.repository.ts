import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class PaymentsRepository {
   async createPaymentsStudents(payments: any) {
      return db.tab_aluno_contrato_pagamento.bulkCreate(payments);
   }

   async getDuePayments(companyId: string) {
      const now = new Date();

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      return db.tab_aluno_contrato_pagamento.findAll({
         where: {
            status_aluno_contrato_pagamento: "overdue",
            expiracao_aluno_contrato_pagamento: {
               [Op.gte]: startOfMonth,
               [Op.lt]: startOfNextMonth,
            },
         },
         include: [
            {
               model: db.tab_aluno_contrato,
               as: "contract",
               where: { cod_empresa: companyId },
               include: [{ model: db.tab_aluno, as: "aluno" }],
            },
         ],
         // limit: 5,
      });
   }

   async getFinanceDashboard() {
      // Consulta única agrupando por status
      const totals = await db.tab_aluno_contrato_pagamento.findAll({
         attributes: [
            "status_aluno_contrato_pagamento",
            [db.sequelize.fn("SUM", db.sequelize.col("valor_aluno_contrato_pagamento")), "total"],
         ],
         where: {
            status_aluno_contrato_pagamento: ["pending", "Pending", "overdue", "succeeded", "confirmed", "paid"],
         },
         group: ["status_aluno_contrato_pagamento"],
      });

      const response: Record<string, number> = { pending: 0, overdue: 0, succeeded: 0 };
      const pattern: Record<string, string[]> = {
         pending: ["pending", "Pending"],
         overdue: ["overdue"],
         succeeded: ["confirmed", "succeeded", "paid"],
      };

      totals.forEach((item) => {
         const status = item.getDataValue("status_aluno_contrato_pagamento");
         const total = parseFloat(item.getDataValue("total"));

         for (const key in pattern) {
            if (pattern[key].includes(status)) {
               response[key] += total;
               break;
            }
         }
      });

      return response;
   }

   async findById(id: string) {
      return db.tab_aluno_contrato_pagamento.findByPk(id, {
         include: [
            {
               model: db.tab_aluno_contrato,
               as: "contract",
            },
         ],
      });
   }

   async findByPaymentId(id: string) {
      return db.tab_aluno_contrato_pagamento.findOne({ where: { asaas_id: id } });
   }

   async findPayments(companyId: string) {
      return db.tab_aluno_contrato_pagamento.findAll({
         include: [
            {
               paranoid: false,
               model: db.tab_aluno_contrato,
               as: "contract",
               where: { cod_empresa: companyId },
               include: [
                  {
                     model: db.tab_aluno,
                     as: "aluno",
                  },
               ],
            },
         ],
      });
   }

   async findPayouts(companyId: string, date: string) {
      const inputDate = new Date(date);
      const startOfMonth = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
      const startOfNextMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 1);
      const test = await db.payouts.findAll({
         include: [
            {
               model: db.payout_payments,
               as: "payments",
               include: [
                  {
                     model: db.tab_aluno_contrato_pagamento,
                     as: "payment",
                     include: [
                        {
                           model: db.tab_aluno_contrato,
                           as: "contract",
                           include: [
                              {
                                 model: db.tab_aluno,
                                 as: "aluno",
                              },
                           ],
                        },
                     ],
                  },
               ],
            },
         ],
         where: {
            companyId,
            date: {
               [Op.gte]: startOfMonth,
               [Op.lt]: startOfNextMonth,
            },
         },
      });
      return test;
   }
}
