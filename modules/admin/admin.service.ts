import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import moment from "moment-timezone";
import { CompaniesRepository } from "../companies/companies.repository";
import { ContractsRepository } from "../contracts/contracts.repository";
import { MailsService } from "../mails/mails.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { PhysicalAssessmentsRepository } from "../physicalAssessments/physicalAssessments.repository";
import { StorageService } from "../storage/storage.service";
import { StudentsRepository } from "../students/students.repository";
import { WorkoutsRepository } from "../workouts/workouts.repository";
import { WPAPI } from "../wp/wp.api";
import { WPService } from "../wp/wp.service";
import { AdminRepository } from "./admin.repository";
const dev = process.env.NODE_ENV !== "production";

@Injectable()
export class AdminService {
   constructor(
      private readonly adminRepository: AdminRepository,
      private readonly companiesRepository: CompaniesRepository,
      private readonly paymentsRepository: PaymentsRepository,
      private readonly studentsRepository: StudentsRepository,
      private readonly physicalAssessmentsRepository: PhysicalAssessmentsRepository,
      private readonly workoutsRepository: WorkoutsRepository,
      private readonly contractsRepository: ContractsRepository,
      private readonly mailsService: MailsService,
      private readonly wpAPI: WPAPI,
      private readonly wpService: WPService,
      private readonly storageService: StorageService,
   ) {}

   async resetTrial(companyId: string) {
      return this.adminRepository.resetTrial(companyId);
   }

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
            moment(JSON.parse(p.jsonwebhook_aluno_contrato_pagamento).estimatedCreditDate) <= endDateRaw,
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

   async getLicenses() {
      return this.adminRepository.getLicenses();
   }

   async createOrEditLicenses(license: any) {
      return this.adminRepository.createOrEditLicenses(license);
   }

   async sendPayoutNotify(companyId: string, proof: Buffer, clients: string, startDate: string, endDate: string) {
      const company = (await this.companiesRepository.findById(companyId)) as any;
      const name = company.nome_empresa;
      const email = company.email_empresa;
      const phone = company.telefone_empresa;

      var amount = 0;
      var clientsArray = [];
      if (JSON.parse(clients).length > 0) {
         clientsArray = JSON.parse(clients);
         JSON.parse(clients).forEach((element: any) => {
            amount += element.amount;
         });
      }

      const uuid = randomUUID();
      const key = `${dev ? "developer/" : ""}proofs/${companyId}/${uuid}`;
      const url = await this.storageService.uploadFileBuffer(proof, key);

      this.adminRepository.registerPayout(companyId, amount, url, clientsArray);

      return this.mailsService.payout(
         name,
         email,
         clients,
         new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount || 0),
         proof,
         moment(startDate).format("DD/MM/YYYY"),
         moment(endDate).format("DD/MM/YYYY"),
      );
   }
}
