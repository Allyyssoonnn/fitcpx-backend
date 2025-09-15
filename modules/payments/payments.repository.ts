import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class PaymentsRepository {
   async createPaymentsStudents(payments: any) {
      return db.tab_aluno_contrato_pagamento.bulkCreate(payments);
   }
}
