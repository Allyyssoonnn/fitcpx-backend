import { Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import { CompaniesService } from "../companies/companies.service";
import { CustomerPaymentService, PaymentService } from "../payments/payment.service";
import { LicensesRepository } from "./licenses.repository";

@Injectable()
export class LicensesService {
   constructor(
      private readonly licensesRepository: LicensesRepository,
      private readonly companiesService: CompaniesService,
      private readonly paymentService: PaymentService
   ) {}

   async getLicensesAvaliables() {
      return this.licensesRepository.findAll();
   }

   async buyLicense(companyId: string, licenseId: string) {
      const company = (await this.companiesService.getById(companyId)) as any;
      const license = (await this.licensesRepository.findById(licenseId)) as any;

      const customer: CustomerPaymentService = {
         name: company.nome_empresa,
         address: company.endereco_empresa,
         cep: company.cep_empresa,
         doc: company.doc_empresa,
         email: company.email_empresa,
         externalId: companyId,
         number: company.numero_empresa,
         phone: company.telefone_empresa,
         state: company.estado_empresa,
         customerId: company.asaas_id,
      };

      await this.companiesService.cancelAllCompanyLicenses(companyId);

      const companyLicense = (await this.companiesService.createOrUpdateCompanyLicense(companyId, licenseId)) as any;

      const paymentId = await this.paymentService.createPayment(
         customer,
         null,
         "UNDEFINED",
         companyLicense.cod_empresa_licenca,
         license.valor_licenca,
         null,
         "",
         moment(new Date()).format("YYYY/MM/DD"),
         "Use License",
         null,
         "Lab Complex Dev LTDA"
      );

      return await this.companiesService.createOrUpdateCompanyLicense(
         companyId,
         licenseId,
         paymentId,
         companyLicense.cod_empresa_licenca
      );
   }
}
