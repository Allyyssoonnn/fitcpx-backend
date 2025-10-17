import { HttpException, Injectable } from "@nestjs/common";
import { PaymentService } from "../payments/payment.service";
import { StorageService } from "../storage/storage.service";
import { CompaniesRepository } from "./companies.repository";
const dev = process.env.NODE_ENV !== "development";

@Injectable()
export class CompaniesService {
   constructor(
      private readonly companiesRepository: CompaniesRepository,
      private readonly storageService: StorageService,
      private readonly paymentService: PaymentService
   ) {}

   async getAll() {
      return await this.companiesRepository.findAll();
   }

   async getById(id: string) {
      return await this.companiesRepository.findById(id);
   }

   async getByEmail(email: string) {
      return await this.companiesRepository.findByEmail(email);
   }

   async createOrUpdate(data: any) {
      return await this.companiesRepository.createOrUpdate(data);
   }

   async updateImageCompany(companyId: string, fileBuffer: Express.Multer.File) {
      if (!fileBuffer) throw new HttpException("Arquivo não enviado.", 400);

      const key = `${dev ? "developer/" : ""}empresa/perfil/${Date.now()}_${fileBuffer.originalname}`;
      const url = await this.storageService.uploadFile(fileBuffer, key);

      this.companiesRepository.updateImageCompany(companyId, url);
      return url;
   }

   async createOrUpdateCompanyLicense(data: any) {
      return this.companiesRepository.createOrUpdateCompanyLicense(data);
   }

   async cancelAllCompanyLicenses(companyId: string) {
      const companyLicenses = await this.companiesRepository.findAllCompaniesLicenses(companyId);
      for (const companyLicense of companyLicenses as any) {
         if (companyLicense.asaas_id) await this.paymentService.deleteSignatureOrInstallment(companyLicense.asaas_id);
         if (companyLicense?.payments && companyLicense.payments.length > 0) {
            for (const payment of companyLicense.payments) {
               if (payment.asaas_id) await this.paymentService.deleteInvoice(payment.asaas_id);
            }
         }
      }

      return this.companiesRepository.cancelAllCompanyLicenses(companyId);
   }

   async getAllCompaniesLicenses(companyId: string) {
      return await this.companiesRepository.findAllCompaniesLicenses(companyId);
   }

   async getCompanyLicense(companyId: string) {
      return await this.companiesRepository.findCompanyLicenseActive(companyId);
   }

   async getDashboardInfo(companyId: string) {
      return await this.companiesRepository.getDashboardInfo(companyId);
   }

   async sendFeedback(companyId: string, type: string, message: string) {
      return await this.companiesRepository.createFeedback(companyId, type, message);
   }

   async getNotifications(companyId: string) {
      let notifications = [];
      let companyLicenses = (await this.companiesRepository.findAllCompaniesLicenses(companyId))[0] as any;

      let paymentPending =
         companyLicenses?.payments.filter((p: any) => p.status_empresa_licenca_pagamento == "Pending") ?? [];

      for (const payment of paymentPending) {
         notifications.push({
            title: "Você tem uma fatura vencida",
            content: `Fatura ${payment.empresaLicenca?.licenca?.nome_licenca} ${new Intl.NumberFormat("pt-BR", {
               style: "currency",
               currency: "BRL",
            }).format(payment.valor_empresa_licenca_pagamento)} aguardando pagamento`,
            type: "Licença",
            icon: "bi bi-cash",
            color: "danger",
         });
      }

      return notifications;
   }
}
