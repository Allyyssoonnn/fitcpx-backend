import { Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import { getNextPayoutDate, getStartDateFromPayout } from "../../utils/global";
import { CompaniesRepository } from "../companies/companies.repository";
import { ContractsRepository } from "../contracts/contracts.repository";
import { EventsService } from "../events/events.service";
import { StudentsRepository } from "../students/students.repository";
import { PaymentAPI } from "./payment.api";
import { PaymentsRepository } from "./payments.repository";

export type CustomerPaymentService = {
   customerId?: string;
   name: string;
   email: string;
   phone: string;
   doc: string;
   address: string;
   number: string;
   state: string;
   cep: string;
   externalId: string;
};

@Injectable()
export class PaymentService {
   constructor(
      private readonly paymentAPI: PaymentAPI,
      private readonly paymentsRepository: PaymentsRepository,
      private readonly studentsRepository: StudentsRepository,
      private readonly companiesRepository: CompaniesRepository,
      private readonly contractsRepository: ContractsRepository,
      private readonly eventsService: EventsService
   ) {}

   async getNextPayout(companyId: string) {
      // 1. Calcular as datas de referência apenas UMA vez
      // Se não passar endDate, calculamos o próximo payout
      const defaultNextPayout = getNextPayoutDate();

      // BUG FIX: Se startDate existir, usamos moment(startDate), senão calculamos baseado no payout
      const startMoment = moment(getStartDateFromPayout(defaultNextPayout));

      const endMoment = moment(defaultNextPayout);

      // Ajuste fino: para garantir que pegue o dia todo, costuma-se usar startOf e endOf
      // startMoment.startOf('day');
      // endMoment.endOf('day');

      const response = {
         value: 0,
         date: defaultNextPayout.toLocaleDateString("pt-BR"), // Mantemos a data calculada originalmente
      };

      const payments = await this.paymentsRepository.findPayments(companyId);

      // 3. Iteração Otimizada com for...of (mais legível e performático que map mal usado)
      for (const p of payments as any) {
         // Validação básica se existe o JSON
         if (!p.jsonwebhook_aluno_contrato_pagamento) continue;

         try {
            const metaData = JSON.parse(p.jsonwebhook_aluno_contrato_pagamento);
            if (!metaData?.estimatedCreditDate) continue;

            const creditDate = moment(metaData.estimatedCreditDate);
            // Comparação de datas com Moment
            // Logica: data > inicial E data <= final
            if (creditDate.isAfter(startMoment) && creditDate.isSameOrBefore(endMoment)) {
               // Converte para Number para evitar concatenação de strings acidental
               response.value += Number(p.liquido_aluno_contrato_pagamento || 0);
            }
         } catch (error) {
            console.error("Erro ao processar JSON do pagamento", p.id, error);
         }
      }

      return response;
   }

   async createPayment(
      customer: CustomerPaymentService,
      paymentMethod: "MANUAL" | "UNICA" | "PARCELADO" | "RECORRENTE" | null,
      billingType: "CREDIT_CARD" | "PIX" | "BOLETO" | "UNDEFINED",
      externalId: string,
      value: number,
      installmentsCount: number | null,
      installments: string,
      dueDate: string,
      description: string,
      initialPayment: number | null,
      companyName: string,
      interestPercentage?: string,
      finePercentage?: string,
      cycle?: 1 | 6 | 12 | null
   ) {
      // * MANUAL
      if (paymentMethod === "MANUAL") {
         let payments = JSON.parse(installments)
            .slice(1)
            .map((parcela: any, i: number) => ({
               cod_aluno_contrato: externalId,
               data_aluno_contrato_pagamento: moment()
                  .add(i + 1, "months")
                  .toDate(),
               expiracao_aluno_contrato_pagamento: moment()
                  .add(i + 1, "months")
                  .toDate(),
               valor_aluno_contrato_pagamento: parcela,
               liquido_aluno_contrato_pagamento: parcela,
               forma_aluno_contrato_pagamento: billingType,
               ambiente_aluno_contrato_pagamento: process.env.NODE_ENV,
            }));

         return this.paymentsRepository.createPaymentsStudents(payments);
      }
      let asaasId = null;

      let apiId = customer.customerId;

      if (!apiId) {
         let clientAsaas = (await this.paymentAPI.newClient(
            customer.name,
            customer.email,
            customer.doc,
            customer.phone,
            customer.address,
            customer.number,
            customer.state,
            customer.cep,
            customer.externalId,
            companyName
         )) as any;

         if (clientAsaas.id) {
            apiId = clientAsaas.id;
            if (description == "Use License") {
               this.companiesRepository.updateApiId(customer.externalId, apiId ?? null);
            } else {
               this.studentsRepository.updateApiId(customer.externalId, apiId ?? null);
            }
         } else {
            return clientAsaas;
         }
      }

      if (initialPayment && initialPayment > 0) {
         // * CRIA A COBRANCA DE ADESAO

         const dueDateHiring = moment(dueDate);
         await this.paymentAPI.createPayment(
            apiId ?? null,
            externalId,
            initialPayment,
            String(dueDateHiring),
            null,
            billingType,
            `Adesão - ${description}`,
            interestPercentage,
            finePercentage
         );
      }

      // *** SOMENTE LICENCA
      if (billingType === "UNDEFINED") {
         if (cycle && cycle > 1) {
            return await this.paymentAPI.createPayment(
               apiId ?? null,
               externalId,
               value,
               String(moment(dueDate).format("YYYY-MM-DD")),
               cycle,
               billingType,
               description,
               interestPercentage,
               finePercentage
            );
         } else {
            return await this.paymentAPI.createSignature(
               apiId ?? null,
               externalId,
               value,
               String(moment(dueDate).format("YYYY-MM-DD")),
               null,
               billingType,
               description,
               interestPercentage,
               finePercentage,
               cycle
            );
         }
      }

      if (paymentMethod === "RECORRENTE" && billingType === "CREDIT_CARD") {
         // * RECORRÊNCIA - CARTÃO DE CRÉDITO / ASSINATURA
         const respAsaas = await this.paymentAPI.createSignature(
            apiId ?? null,
            externalId,
            value,
            String(moment(dueDate).format("YYYY-MM-DD")),
            Number(JSON.parse(installments).lenght) ?? null,
            billingType,
            description,
            interestPercentage,
            finePercentage
         );
         if (respAsaas.id) asaasId = respAsaas.id;
      } else {
         // * OUTROS FORMAS DE PAGAMENTO
         JSON.parse(installments).map(async (parcela: number, i: number) => {
            if (i > 0 && (paymentMethod === "UNICA" || paymentMethod === "PARCELADO")) return;
            var valueInstallment: number = paymentMethod === "UNICA" || paymentMethod === "PARCELADO" ? value : parcela;

            const dueDateInstallment = moment(dueDate).add(i, "months").format("YYYY-MM-DD");
            const respAsaas = await this.paymentAPI.createPayment(
               apiId ?? null,
               externalId,
               valueInstallment,
               String(dueDateInstallment),
               installmentsCount ?? null,
               billingType,
               description,
               interestPercentage,
               finePercentage
            );
            if (respAsaas.id) asaasId = respAsaas.id;
         });
      }

      return asaasId;
   }

   async markPaymentReceived(paymentId: string) {
      const response = await this.paymentAPI.markPaymentReceived(paymentId);
      if (response) {
         let payment = (await this.paymentsRepository.findByPaymentId(paymentId)) as any;
         let contract = (await this.contractsRepository.findById(payment.cod_aluno_contrato)) as any;

         if (contract?.cod_aluno) await this.eventsService.confirmedPayment(contract?.cod_aluno);
      }
      return response;
   }

   async deleteSignatureOrInstallment(paymentId: string) {
      return this.paymentAPI.deleteSignatureOrInstallment(paymentId);
   }

   async deleteInvoice(paymentId: string) {
      return this.paymentAPI.deleteInoice(paymentId);
   }

   async findInovicesSignature(subscriptionId: string) {
      return this.paymentAPI.findInovicesSignature(subscriptionId);
   }
}
