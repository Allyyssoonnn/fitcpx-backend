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

      const requiredFields: { key: keyof typeof company; message: string }[] = [
         { key: "doc_empresa", message: "CNPJ ou CPF do profissional não informado" },
         { key: "nome_empresa", message: "Nome do profissional não informado" },
         { key: "endereco_empresa", message: "Endereço do profissional não informado" },
         { key: "cep_empresa", message: "CEP do profissional não informado" },
         { key: "numero_empresa", message: "Número do endereço não informado" },
         { key: "telefone_empresa", message: "Telefone do profissional não informado" },
         { key: "estado_empresa", message: "Estado do profissional não informado" },
         { key: "email_empresa", message: "Email do profissional não informado" },
      ];

      for (const field of requiredFields) {
         if (!company[field.key]) {
            throw new HttpException(field.message, 403);
         }
      }

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

      if (!paymentId?.id) {
         await this.companiesService.createOrUpdateCompanyLicense({
            ...companyLicense.dataValues,
            status_empresa_licenca: "Failed",
         });
         await this.licensesRepository.deleteById(companyLicense.cod_empresa_licenca);

         if (paymentId?.errors?.length > 0) {
            throw new HttpException(`Erros: ${paymentId?.errors?.map((error: any) => error.description)}`, 403);
         }

         throw new HttpException("Error to process the payment", 403);
      } else {
         return await this.companiesService.createOrUpdateCompanyLicense({
            ...companyLicense.dataValues,
            asaas_id: paymentId.id,
         });
      }
   }
}
