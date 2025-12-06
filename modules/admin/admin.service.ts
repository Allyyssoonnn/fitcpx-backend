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

      return formatedPayments;
   }

   async getRefreshTokens(date: string) {
      return this.adminRepository.getRefreshTokens(date);
   }

   async getClientsCount() {
      return this.adminRepository.getClientsCount();
   }
}
