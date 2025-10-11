import { Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import { AdminRepository } from "./admin.repository";

@Injectable()
export class AdminService {
   constructor(private readonly adminRepository: AdminRepository) {}

   async printPayout(companyId: string) {
      function getPayoutDay(day: number) {
         if (day < 10) return 30;
         if (day < 20) return 10;
         if (day < 30) return 20;
         return 30;
      }
      const today = moment();

      const payoutDay = getPayoutDay(today.date());
      const month = today.month();

      const initialDate = moment({
         day: payoutDay - 9,
         month,
         year: today.year(),
      }).format("YYYY-MM-DD");

      const endDate = moment({
         day: payoutDay,
         month,
         year: today.year(),
      }).format("YYYY-MM-DD");

      const payments = await this.adminRepository.findLicensePayments(companyId, initialDate, endDate);

      const formatedPayments = payments.map((v: any) => ({
         name: v.contract.aluno.nome_aluno,
         date: moment(JSON.parse(v.jsonwebhook_aluno_contrato_pagamento).paymentDate).format("DD/MM/YYYY"),
         amount: `R$ ${String(v.liquido_aluno_contrato_pagamento).replace(".", ",")}`,
      }));
      console.log(formatedPayments);
      console.log(JSON.stringify(formatedPayments));
   }
}
