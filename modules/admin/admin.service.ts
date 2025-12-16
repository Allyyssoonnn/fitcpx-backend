import { Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import { CompaniesRepository } from "../companies/companies.repository";
import { ContractsRepository } from "../contracts/contracts.repository";
import { PaymentsRepository } from "../payments/payments.repository";
import { PhysicalAssessmentsRepository } from "../physicalAssessments/physicalAssessments.repository";
import { StudentsRepository } from "../students/students.repository";
import { WorkoutsRepository } from "../workouts/workouts.repository";
import { AdminRepository } from "./admin.repository";

@Injectable()
export class AdminService {
   constructor(
      private readonly adminRepository: AdminRepository,
      private readonly companiesRepository: CompaniesRepository,
      private readonly paymentsRepository: PaymentsRepository,
      private readonly studentsRepository: StudentsRepository,
      private readonly physicalAssessmentsRepository: PhysicalAssessmentsRepository,
      private readonly workoutsRepository: WorkoutsRepository,
      private readonly contractsRepository: ContractsRepository
   ) {}

   async getNewClientsDashboard(year?: number) {
      return this.adminRepository.getNewClientsDashboardByMonth(year);
   }

   async getFinanceDashboard() {
      return this.paymentsRepository.getFinanceDashboard();
   }

   async getClients() {
      return this.adminRepository.getClients();
   }

   async getClient(companyId: string) {
      return this.adminRepository.getClient(companyId);
   }

   async getClientInfo(companyId: string) {
      const qtdStudents = await this.studentsRepository.count(companyId);
      const qtdPhysicalAssessments = await this.physicalAssessmentsRepository.count(companyId);
      const qtdWorkouts = await this.workoutsRepository.count(companyId);
      const qtdContracts = await this.contractsRepository.count(companyId);

      return {
         qtdStudents,
         qtdPhysicalAssessments,
         qtdWorkouts,
         qtdContracts,
      };
   }

   async getLicensesClients(companyId: string) {
      return this.companiesRepository.findAllCompaniesLicenses(companyId);
   }

   async printPayout(companyId: string, startDate: string, endDate: string) {
      const initialDateRaw = moment(startDate);
      const initialDate = startDate;
      const endDateRaw = moment(endDate);

      const payments = await this.adminRepository.findLicensePayments(companyId, initialDate, endDate);

      const paymentsFiltered = payments.filter(
         (p: any) =>
            !!p.jsonwebhook_aluno_contrato_pagamento &&
            !!JSON.parse(p.jsonwebhook_aluno_contrato_pagamento)?.estimatedCreditDate &&
            moment(JSON.parse(p.jsonwebhook_aluno_contrato_pagamento).estimatedCreditDate) > initialDateRaw &&
            moment(JSON.parse(p.jsonwebhook_aluno_contrato_pagamento).estimatedCreditDate) <= endDateRaw
      );

      const formatedPayments = paymentsFiltered.map((v: any) => ({
         name: v.contract?.aluno?.nome_aluno,
         date: moment(JSON.parse(v.jsonwebhook_aluno_contrato_pagamento).estimatedCreditDate).format("DD/MM/YYYY"),
         amount: v.liquido_aluno_contrato_pagamento,
         value: JSON.parse(v.jsonwebhook_aluno_contrato_pagamento).value,
         netValue: JSON.parse(v.jsonwebhook_aluno_contrato_pagamento).netValue,
         status: v.status_aluno_contrato_pagamento,
         url: v.asaas_url,
         paymentId: v.asaas_id,
         id: v.cod_aluno_contrato_pagamento,
      }));

      return formatedPayments;
   }

   async getRefreshTokens(date: string) {
      return this.adminRepository.getRefreshTokens(date);
   }

   async getClientsCount() {
      return this.adminRepository.getClientsCount();
   }
}
