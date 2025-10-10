import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class PaymentsRepository {
   async createPaymentsStudents(payments: any) {
      return db.tab_aluno_contrato_pagamento.bulkCreate(payments);
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
