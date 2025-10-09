import { HttpException, Injectable } from "@nestjs/common";
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

      const companyLicense = (await this.companiesService.createOrUpdateCompanyLicense({
         cod_empresa: companyId,
         cod_licenca: licenseId,
      })) as any;

      const paymentId = await this.paymentService.createPayment(
         customer,
         "RECORRENTE",
         "UNDEFINED",
         companyLicense.cod_empresa_licenca,
         license.valor_licenca,
         null,
         "",
         String(new Date()),
         "Use License",
         null,
         "Lab Complex Dev LTDA"
      );

      if (!paymentId) {
         await this.companiesService.createOrUpdateCompanyLicense({
            ...companyLicense.dataValues,
            status_empresa_licenca: "Failed",
         });
         await this.companiesService.cancelCompanyLicense(companyId, companyLicense.cod_empresa_licenca);
         return new HttpException("Error to process the payment", 403);
      } else {
         return await this.companiesService.createOrUpdateCompanyLicense({
            ...companyLicense.dataValues,
            asaas_id: paymentId,
         });
      }
   }
}
