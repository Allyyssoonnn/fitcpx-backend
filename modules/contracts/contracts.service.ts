import { HttpException, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import moment from "moment-timezone";
import puppeteer from "puppeteer";
import { CompaniesRepository } from "../companies/companies.repository";
import { CustomerPaymentService, PaymentService } from "../payments/payment.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { PlansRepository } from "../plans/plans.repository";
import { StudentsRepository } from "../students/students.repository";
import { StudentsService } from "../students/students.service";
import { ContractsAPI } from "./contracts.api";
import { preencherContrato, processaPlano } from "./contracts.funcs";
import { ContractsRepository } from "./contracts.repository";

@Injectable()
export class ContractsService {
   constructor(
      private readonly contractsRepository: ContractsRepository,
      private readonly contractsAPI: ContractsAPI,
      private readonly paymentsService: PaymentService,
      private readonly paymentsRepository: PaymentsRepository,
      private readonly studentsRepository: StudentsRepository,
      private readonly studentsService: StudentsService,
      private readonly companiesRepository: CompaniesRepository,
      private readonly plansRepository: PlansRepository,
      private readonly eventEmitter: EventEmitter2,
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
         multa_compensatoria,
         multa_moratoria,
         juros_atraso,
      } = plano;

      const {
         // ["monthly", "cash", "installments"]
         metodo_pagamento,
         parcelas: numParcelas,
         metodo_recorrencia,
      } = plano;

      const pattern: { [key: string]: string } = {
         monthly: "RECORRENTE",
         cash: "UNICA",
         installments: "PARCELADO",
         none: "MANUAL",
      };

      let company = (await this.companiesRepository.findById(companyId)) as any;

      // *** INICIALIZA AS VARIAVEIS

      const initialDate = pagamentoInicial
         ? moment.tz(pagamentoInicial, "America/Sao_Paulo")
         : moment.tz(new Date(), "America/Sao_Paulo");
      const resumoParcelas = JSON.parse(parcela_plano);
      const duration = resumoParcelas.length;
      const value = pattern[metodo_pagamento] === "RECORRENTE" && duration > 0 ? resumoParcelas[0] : valor_plano;
      const installmentsCount =
         pattern[metodo_pagamento] === "UNICA" || pattern[metodo_pagamento] === "PARCELADO" ? numParcelas : null;

      const description = modalidades
         .map((m: any) => {
            const nome = m?.nome_modalidade || ""; // Garante string vazia se falhar
            return nome;
         })
         .filter((desc: any) => desc !== "") // Remove strings vazias geradas por dados ruins
         .join(", ");

      // *** REUNE INFORMACOES DO ALUNO
      let student = (await this.studentsRepository.findById(cod_aluno, companyId)) as any;

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
            nome_aluno_contrato: nome_plano ? nome_plano : description,
            iniciopagamento_aluno_contrato: pagamentoInicial,
            adesao_aluno_contrato: valor_adesao,
            parcela_aluno_contrato: parcela_plano,
            total_aluno_contrato: valor_plano,
            arquivo_aluno_contrato: contrato,
            duracao_aluno_contrato: duracao_plano,
            expiracao_aluno_contrato: moment(pagamentoInicial)
               .tz("America/Sao_Paulo")
               .add(duracao_plano, "months")
               .format("YYYY-MM-DD"),
            modalidades_aluno_contrato: JSON.stringify(modalidades),
            ambiente_aluno_contrato: process.env.NODE_ENV,
            multa_compensatoria,
         },
         modalidades,
      );

      const response = await this.paymentsService.createPayment(
         customer,
         pattern[metodo_pagamento] as "RECORRENTE" | "UNICA" | "PARCELADO" | "MANUAL" | null,
         metodo_pagamento == "installments" || (metodo_pagamento == "monthly" && metodo_recorrencia == "monthly_card")
            ? "CREDIT_CARD"
            : "UNDEFINED",
         contractDB.cod_aluno_contrato,
         value,
         installmentsCount != null ? Number(installmentsCount) : null,
         installmentsCount != null ? Number(installmentsCount) : null,
         parcela_plano,
         String(initialDate),
         description,
         valor_adesao,
         `${companyId}_${company.nome_empresa}`,
         juros_atraso,
         multa_moratoria,
         null,
         true,
         true,
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
      if (contractDB.cod_aluno_contrato && response?.id) {
         await this.contractsRepository.updateContractData(contractDB.cod_aluno_contrato, { asaas_id: response.id });
      }

      const contract = (await this.contractsRepository.findById(contractDB.cod_aluno_contrato)) as any;

      await this.contractsRepository.createOrUpdateContract(
         {
            ...contract.dataValues,
            cod_aluno_contrato: contractDB.cod_aluno_contrato,
            status_aluno_contrato: "Ativo",
            formapagamento_aluno_contrato: pattern[metodo_pagamento] as
               | "RECORRENTE"
               | "UNICA"
               | "PARCELADO"
               | "MANUAL"
               | null,
            tipopagamento_aluno_contrato: metodo_pagamento == "installments" ? "CREDIT_CARD" : "PIX",
            descricao_aluno_contrato: description,
         },
         [],
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

         if (student?.cod_aluno) {
            this.studentsRepository.updateStatus(student.cod_aluno, "B", "Aguardando assinatura de contrato");
         }
      }

      if (student?.cod_aluno) {
         await this.eventEmitter.emitAsync("new.contract", student.cod_aluno);
      }

      return response;
   }

   async downloadContract(documentId: string, signed: boolean) {
      const contract = (await this.contractsRepository.findByAutentiqueID(documentId)) as any;

      if (contract && contract.statusautentique_aluno_contrato === "O aluno assinou o contrato.") {
         return this.contractsAPI.downloadContract(documentId, true);
      }

      return this.contractsAPI.downloadContract(documentId, false);
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

   //Única diferença do outro metodo é que não tem dataInicial e não tem cod_usuario
   async onlineContract(companyId: string, student: any, plan: any, registerOnly: boolean = false) {
      const company = (await this.companiesRepository.findById(companyId)) as any;
      const planDB = plan.cod_plano ? ((await this.plansRepository.findById(plan.cod_plano)) as any) : null;
      const modContrato = planDB?.contrato || null;
      var studentDB;
      var contractURL;

      const {
         // ["monthly", "cash", "installments"]
         metodo_pagamento,
         parcelas: numParcelas,
         metodo_recorrencia,
      } = plan;

      const pattern: { [key: string]: string } = {
         monthly: "RECORRENTE",
         cash: "UNICA",
         installments: "PARCELADO",
      };

      if (!company?.cod_empresa) throw new HttpException("Erro ao encontrar empresa", 403);

      if (
         (student?.email_aluno && (await this.studentsRepository.findByEmail(student.email_aluno, companyId))) ||
         (student?.cpf_aluno && (await this.studentsRepository.findByCPF(student.cpf_aluno, companyId))) ||
         student.cod_aluno
      ) {
         if (registerOnly) throw new HttpException("E-mail ou CPF já cadastrado", 403);

         studentDB = (await this.studentsService.verifyExists(
            student.email_aluno,
            student.cpf_aluno,
            companyId,
         )) as any;
         studentDB = await this.studentsService.update({
            ...student,
            cod_aluno: studentDB.cod_aluno,
         });
      } else {
         studentDB = await this.studentsService.createOrUpdate(student, companyId);

         if (registerOnly) return;
      }

      if (!studentDB?.cod_aluno) throw new HttpException("Erro ao cadastrar novo aluno", 403);

      const customer: CustomerPaymentService = {
         name: studentDB.nome_aluno,
         address: studentDB.endereco_aluno,
         cep: studentDB.cep_aluno,
         doc: studentDB.cpf_aluno,
         email: studentDB.email_aluno,
         externalId: studentDB.cod_aluno,
         number: studentDB.numero_aluno,
         phone: studentDB.telefone_aluno,
         state: studentDB.estado_aluno,
         customerId: studentDB.asaas_id,
      };

      var planReady = processaPlano(planDB, planDB.duracao_plano, planDB.valor_adesao) as any;

      var contrato = modContrato
         ? preencherContrato(modContrato.contrato, studentDB, company, planReady.modalidades, planReady, new Date())
         : null;

      const description = planReady.modalidades
         .map((m: any) => {
            const nome = m?.nome_modalidade || ""; // Garante string vazia se falhar
            return nome;
         })
         .filter((desc: any) => desc !== "") // Remove strings vazias geradas por dados ruins
         .join(", ");

      //Não consta
      // const initialDate = pagamentoInicial
      // ? moment.tz(pagamentoInicial, "America/Sao_Paulo")
      // : moment.tz(new Date(), "America/Sao_Paulo");
      const initialDate = moment.tz(new Date(), "America/Sao_Paulo");
      const resumoParcelas = JSON.parse(planReady.parcela_plano);
      const duration = resumoParcelas.length;
      const value =
         pattern[metodo_pagamento] === "RECORRENTE" && duration > 0 ? resumoParcelas[0] : planReady.valor_plano;

      let contractDB = await this.contractsRepository.createOrUpdateContract(
         {
            cod_aluno: studentDB.cod_aluno,
            cod_empresa: companyId,
            //Não consta
            // cod_usuario: -,
            nome_aluno_contrato: planReady.nome_plano,
            iniciopagamento_aluno_contrato: initialDate,
            adesao_aluno_contrato: planReady.valor_adesao,
            parcela_aluno_contrato: plan.parcelas,
            total_aluno_contrato: planReady.valor_adesao
               ? planReady.valor_plano + planReady.valor_adesao
               : planReady.valor_plano,
            arquivo_aluno_contrato: contrato,
            duracao_aluno_contrato: planReady.duracao_plano,
            expiracao_aluno_contrato: moment()
               .tz("America/Sao_Paulo")
               .add(planReady.duracao_plano, "months")
               .format("YYYY-MM-DD"),
            modalidades_aluno_contrato: JSON.stringify(planReady.modalidades),
            ambiente_aluno_contrato: process.env.NODE_ENV,
            multa_compensatoria: modContrato?.multa_compensatoria ?? 0,
         },
         planReady.modalidades,
      );

      const response = await this.paymentsService.createPayment(
         customer,
         pattern[metodo_pagamento] as "RECORRENTE" | "UNICA" | "PARCELADO" | "MANUAL" | null,
         metodo_pagamento == "installments" || (metodo_pagamento == "monthly" && metodo_recorrencia == "monthly_card")
            ? "CREDIT_CARD"
            : "UNDEFINED",
         contractDB.cod_aluno_contrato,
         value,
         numParcelas != null ? Number(numParcelas) : null,
         planReady.duracao_plano != null ? Number(planReady.duracao_plano) : null,
         planReady.parcela_plano,
         String(initialDate),
         description,
         planReady.valor_adesao,
         `${companyId}_${company.nome_empresa}`,
         modContrato?.juros_atraso ?? 0,
         modContrato?.multa_moratoria ?? 0,
         null,
         true,
         true,
      );

      if (response?.errors || response.additionalInvoice?.errors) {
         this.contractsRepository.deleteById(contractDB.cod_aluno_contrato);
         let concatError = "";
         if (response?.errors) {
            for (const error of response?.errors) {
               concatError = concatError + `${error.description}\n`;
            }
         }
         if (response.additionalInvoice?.errors) {
            for (const error of response.additionalInvoice?.errors) {
               concatError = concatError + `${error.description}\n`;
            }
         }
         throw new HttpException(concatError, 403);
      }

      // *** ATUALIZA EXTERNALREFERENCE PARA O WORKER UTILIZAR
      if (contractDB.cod_aluno_contrato && response) {
         await this.contractsRepository.updateContractData(contractDB.cod_aluno_contrato, { asaas_id: response.id });
      }

      const contract = (await this.contractsRepository.findById(contractDB.cod_aluno_contrato)) as any;

      await this.contractsRepository.createOrUpdateContract(
         {
            ...contract.dataValues,
            cod_aluno_contrato: contractDB.cod_aluno_contrato,
            status_aluno_contrato: "Ativo",
            formapagamento_aluno_contrato: pattern[metodo_pagamento] as
               | "RECORRENTE"
               | "UNICA"
               | "PARCELADO"
               | "MANUAL"
               | null,
            tipopagamento_aluno_contrato: metodo_pagamento == "installments" ? "CREDIT_CARD" : "PIX",
            descricao_aluno_contrato: description,
         },
         [],
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

         if (contractApi) {
            const signed = false;
            contractURL = await this.contractsAPI.downloadContract(contractApi, signed);
         }
      }

      if (student?.cod_aluno) {
         await this.eventEmitter.emitAsync("new.contract", student.cod_aluno);
      }

      const { invoiceUrl } = response;

      var url = invoiceUrl;

      if (response?.object === "subscription") {
         const payments = await this.paymentsService.findInovicesSignature(response?.id);
         const data = payments.data;
         if (data[0] && data[0]?.invoiceUrl) url = data[0]?.invoiceUrl;
      }

      return {
         url,
         contractURL,
      };
   }

   async contractSigned(documentId: string) {
      const document = (await this.contractsRepository.findByAutentiqueID(documentId)) as any;

      if (document?.cod_aluno) {
         return this.studentsRepository.updateStatus(document.cod_aluno, "A");
      }

      return;
   }
}
