import { Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import puppeteer from "puppeteer";
import { CompaniesRepository } from "../companies/companies.repository";
import { CustomerPaymentService, PaymentService } from "../payments/payment.service";
import { StudentsRepository } from "../students/students.repository";
import { ContractsAPI } from "./contracts.api";
import { ContractsRepository } from "./contracts.repository";

@Injectable()
export class ContractsService {
   constructor(
      private readonly contractsRepository: ContractsRepository,
      private readonly contractsAPI: ContractsAPI,
      private readonly paymentsService: PaymentService,
      private readonly studentsService: StudentsRepository,
      private readonly companiesRepository: CompaniesRepository
   ) {}

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
      } = plano;
      let company = (await this.companiesRepository.findById(companyId)) as any;

      let contractDB = await this.contractsRepository.createOrUpdateContract(
         {
            cod_aluno: cod_aluno,
            cod_usuario: userId,
            cod_empresa: companyId,
            nome_aluno_contrato: nome_plano ?? `Contrato ${moment().format("DD/MM/YYYY")}`,
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
         },
         modalidades
      );

      const contract = (await this.contractsRepository.findById(contractDB.cod_aluno_contrato)) as any;

      const initialDate = contract.iniciopagamento_aluno_contrato
         ? moment.tz(contract.iniciopagamento_aluno_contrato, "America/Sao_Paulo")
         : moment.tz(new Date(), "America/Sao_Paulo");
      const resumoParcelas = JSON.parse(contract?.parcela_aluno_contrato);
      const duration = resumoParcelas.length;
      const value = formaPagamento === "RECORRENTE" && duration > 0 ? resumoParcelas[0] : contract.total_aluno_contrato;
      const installmentsCount = formaPagamento === "UNICA" || formaPagamento === "PARCELADO" ? installments : null;

      const description = contract.modalidades
         .map((m: any) => `${m.modalidade.nome_modalidade} - ${m.variacao.nome_modalidade_variacao}`)
         .join(", ");

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

      return this.paymentsService.createPayment(
         customer,
         formaPagamento,
         typePayment == "CREDIT" ? "CREDIT_CARD" : typePayment,
         contractDB.cod_aluno_contrato,
         value,
         installmentsCount != null ? Number(installmentsCount.lenght) : null,
         parcela_plano,
         String(initialDate),
         description,
         valor_adesao,
         `${companyId}_${company.nome_empresa}`
      );
   }
}
