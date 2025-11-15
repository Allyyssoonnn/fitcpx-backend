import { HttpException, Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import puppeteer from "puppeteer";
import { CompaniesRepository } from "../companies/companies.repository";
import { EventsService } from "../events/events.service";
import { CustomerPaymentService, PaymentService } from "../payments/payment.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { StudentsRepository } from "../students/students.repository";
import { ContractsAPI } from "./contracts.api";
import { ContractsRepository } from "./contracts.repository";

@Injectable()
export class ContractsService {
   constructor(
      private readonly contractsRepository: ContractsRepository,
      private readonly contractsAPI: ContractsAPI,
      private readonly paymentsService: PaymentService,
      private readonly paymentsRepository: PaymentsRepository,
      private readonly studentsService: StudentsRepository,
      private readonly companiesRepository: CompaniesRepository,
      private readonly eventsService: EventsService
   ) {}

   async getDuePayments(companyId: string) {
      return this.paymentsRepository.getDuePayments(companyId);
   }

   async getContracts(companyId: string, studentId?: string) {
      return this.contractsRepository.findAll(companyId, studentId);
   }

   async getContract(contractId: string) {
      return this.contractsRepository.findById(contractId);
   }

   async newContract(companyId: string, userId: string, plano: any) {
      const {
         modalidades,
         valor_plano,
         valor_adesao,
         contrato,
         duracao_plano,
         nome_plano,
         cod_aluno,
         parcela_plano,
         pagamentoInicial = new Date(),
         formaPagamento,
         typePayment,
         installments,
         multa_compensatoria,
         multa_moratoria,
         juros_atraso,
      } = plano;
      let company = (await this.companiesRepository.findById(companyId)) as any;

      // *** INICIALIZA AS VARIAVEIS

      const initialDate = pagamentoInicial
         ? moment.tz(pagamentoInicial, "America/Sao_Paulo")
         : moment.tz(new Date(), "America/Sao_Paulo");
      const resumoParcelas = JSON.parse(parcela_plano);
      const duration = resumoParcelas.length;
      const value = formaPagamento === "RECORRENTE" && duration > 0 ? resumoParcelas[0] : valor_plano;
      const installmentsCount = formaPagamento === "UNICA" || formaPagamento === "PARCELADO" ? installments : null;

      const description = modalidades
         .map(
            (m: any) =>
               `${m.modalidade?.nome_modalidade}${
                  m.variacao?.nome_modalidade_variacao ? ` - ${m.variacao?.nome_modalidade_variacao}` : ""
               }`
         )
         .join(", ");

      // *** REUNE INFORMACOES DO ALUNO
      let student = (await this.studentsService.findById(cod_aluno, companyId)) as any;

      const customer: CustomerPaymentService = {
         name: student.nome_aluno,
         address: student.endereco_aluno,
         cep: student.cep_aluno,
         doc: student.cpf_aluno,
         email: student.email_aluno,
         externalId: cod_aluno,
         number: student.numero_aluno,
         phone: student.telefone_aluno,
         state: student.estado_aluno,
         customerId: student.asaas_id,
      };

      let contractDB = await this.contractsRepository.createOrUpdateContract(
         {
            cod_aluno: cod_aluno,
            cod_usuario: userId,
            cod_empresa: companyId,
            nome_aluno_contrato: nome_plano ?? description ?? `Contrato ${moment().format("DD/MM/YYYY")}`,
            iniciopagamento_aluno_contrato: pagamentoInicial,
            adesao_aluno_contrato: valor_adesao,
            parcela_aluno_contrato: parcela_plano,
            total_aluno_contrato: valor_plano,
            arquivo_aluno_contrato: contrato,
            duracao_aluno_contrato: duracao_plano,
            expiracao_aluno_contrato: moment()
               .tz("America/Sao_Paulo")
               .add(duracao_plano, "months")
               .format("YYYY-MM-DD"),
            modalidades_aluno_contrato: JSON.stringify(modalidades),
            ambiente_aluno_contrato: process.env.NODE_ENV,
            multa_compensatoria,
         },
         modalidades
      );

      const response = await this.paymentsService.createPayment(
         customer,
         formaPagamento,
         typePayment == "CREDIT" ? "CREDIT_CARD" : typePayment,
         contractDB.cod_aluno_contrato,
         value,
         installmentsCount != null ? Number(installmentsCount) : null,
         parcela_plano,
         String(initialDate),
         description,
         valor_adesao,
         `${companyId}_${company.nome_empresa}`,
         juros_atraso,
         multa_moratoria
      );

      if (response?.errors) {
         this.contractsRepository.deleteById(contractDB.cod_aluno_contrato);
         let concatError = "";
         for (const error of response?.errors) {
            concatError = concatError + `${error.description}\n`;
         }
         throw new HttpException(concatError, 403);
      }

      // *** ATUALIZA EXTERNALREFERENCE PARA O WORKER UTILIZAR
      if (contractDB.cod_aluno_contrato && response) {
         await this.contractsRepository.createOrUpdateContract(
            { asaas_id: response, cod_aluno_contrato: contractDB.cod_aluno_contrato },
            []
         );
      }

      const contract = (await this.contractsRepository.findById(contractDB.cod_aluno_contrato)) as any;

      await this.contractsRepository.createOrUpdateContract(
         {
            ...contract.dataValues,
            cod_aluno_contrato: contractDB.cod_aluno_contrato,
            status_aluno_contrato: "Ativo",
            formapagamento_aluno_contrato: formaPagamento,
            tipopagamento_aluno_contrato: typePayment == "CREDIT" ? "CREDIT_CARD" : typePayment,
            descricao_aluno_contrato: description,
         },
         []
      );

      // *** CRIA CONTRATO NO AUTENTIQUE

      if (contrato) {
         const browser = await puppeteer.launch({
            headless: "shell",
            args: ["--no-sandbox"],
         });
         const page = await browser.newPage();
         await page.setContent(contrato, {
            waitUntil: "networkidle0",
         });

         const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
               top: "40px",
               bottom: "40px",
               left: "40px",
               right: "40px",
            },
         });

         await browser.close();

         const contractApi = await this.contractsAPI.createContract(pdfBuffer, customer.email);
         await this.contractsRepository.updateContractApi(contractDB.cod_aluno_contrato, contractApi);
      }

      if (student?.cod_aluno) {
         await this.eventsService.newContract(student.cod_aluno);
      }

      return response;
   }

   async downloadContract(documentId: string, signed: boolean) {
      return this.contractsAPI.downloadContract(documentId, signed);
   }

   async cancelContract(contractId: string) {
      const contract = (await this.contractsRepository.findById(contractId)) as any;

      if (contract?.autentique_aluno_contrato)
         await this.contractsAPI.deleteContract(contract.autentique_aluno_contrato);

      if (contract.asaas_id) await this.paymentsService.deleteSignatureOrInstallment(contract.asaas_id);

      for (const payment of contract.pagamentos) {
         if (payment.asaas_id) await this.paymentsService.deleteInvoice(payment.asaas_id);
      }

      return this.contractsRepository.cancelById(contractId);
   }
}
