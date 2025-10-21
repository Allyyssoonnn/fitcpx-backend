import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class PaymentsRepository {
   async createPaymentsStudents(payments: any) {
      return db.tab_aluno_contrato_pagamento.bulkCreate(payments);
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
}
