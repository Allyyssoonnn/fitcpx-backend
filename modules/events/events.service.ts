import { Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import { CompaniesRepository } from "../companies/companies.repository";
import { MailsService } from "../mails/mails.service";
import { NotificationsService } from "../notifications/notifications.service";
import { PaymentsRepository } from "../payments/payments.repository";

@Injectable()
export class EventsService {
   constructor(
      private readonly mailsService: MailsService,
      private readonly notificationsService: NotificationsService,
      private readonly companiesRepository: CompaniesRepository,
      private readonly paymentsRepository: PaymentsRepository,
   ) {}

   async recoveryPasswordStudent(name: string, email: string, url: string) {
      return this.mailsService.sendMail(email, "recoveryPassword.html", "Recuperação de senha", {
         name,
         url,
         email,
      });
   }

   async recoveryPasswordUser(name: string, email: string, url: string) {
      return this.mailsService.sendMail(email, "recoveryPassword.html", "Recuperação de senha", {
         name,
         url,
         email,
      });
   }

   async newWorkout(studentId: string) {
      if (await this.companiesRepository.verifyStudentNotificationConfig("workoutCreated", "app", studentId)) {
         return await this.notificationsService.sendPushNotification(
            "Novo Treino Disponível",
            "Seu treinador acabou de liberar um novo treino para você. Vamos lá?",
            "workout",
            studentId,
         );
      }
   }

   async newEvent(studentId: string) {
      if (await this.companiesRepository.verifyStudentNotificationConfig("eventCreated", "app", studentId)) {
         return await this.notificationsService.sendPushNotification(
            "Novo Evento Agendado",
            "Seu treinador acabou de agendar um evento para você",
            "calendar",
            studentId,
         );
      }
   }

   async newPhysicalAssessment(studentId: string) {
      if (
         await this.companiesRepository.verifyStudentNotificationConfig("physicalAssessmentCreated", "app", studentId)
      ) {
         await this.notificationsService.sendPushNotification(
            "Nova Avaliação Física",
            "Uma nova avaliação física foi adicionada",
            "physicalAssessment",
            studentId,
         );
      }
   }

   async newContract(studentId: string) {
      if (await this.companiesRepository.verifyStudentNotificationConfig("contractCreated", "app", studentId)) {
         await this.notificationsService.sendPushNotification(
            "Novo plano contratado",
            "Seu novo plano foi contratado com sucesso e já está ativo",
            "contract",
            studentId,
         );
      }
   }

   async overduePayment(paymentId: string) {
      const response = (await this.paymentsRepository.findById(paymentId)) as any;
      if (response?.contract?.cod_aluno) {
         if (
            await this.companiesRepository.verifyStudentNotificationConfig(
               "invoiceOverdue",
               "app",
               response?.contract?.cod_aluno,
            )
         ) {
            return await this.notificationsService.sendPushNotification(
               "Pagamento pendente",
               "Identificamos um pagamento vencido referente ao seu plano",
               "contract",
               response.contract.cod_aluno,
            );
         }
      }
   }

   async createdPayment(paymentId: string) {
      const response = (await this.paymentsRepository.findById(paymentId)) as any;
      if (response?.contract?.cod_aluno) {
         if (
            await this.companiesRepository.verifyStudentNotificationConfig(
               "invoiceCreated",
               "app",
               response?.contract?.cod_aluno,
            )
         ) {
            return await this.notificationsService.sendPushNotification(
               "Fatura disponível",
               "Sua fatura já está disponível para pagamento",
               "contract",
               response.contract.cod_aluno,
            );
         }
      }
   }

   async confirmedPayment(studentId: string | null, paymentId?: string) {
      if (studentId) {
         if (await this.companiesRepository.verifyStudentNotificationConfig("paymentConfirmed", "app", studentId)) {
            return await this.notificationsService.sendPushNotification(
               "Pagamento recebido",
               "Seu pagamento foi confirmado com sucesso",
               "payment",
               studentId,
            );
         }
      } else {
         if (paymentId) {
            const response = (await this.paymentsRepository.findById(paymentId)) as any;
            if (response?.contract?.cod_aluno) {
               if (
                  await this.companiesRepository.verifyStudentNotificationConfig(
                     "paymentConfirmed",
                     "app",
                     response?.contract?.cod_aluno,
                  )
               ) {
                  return await this.notificationsService.sendPushNotification(
                     "Pagamento recebido",
                     "Seu pagamento foi confirmado com sucesso",
                     "payment",
                     response.contract.cod_aluno,
                  );
               }
            }
         }
      }
   }

   async confirmedPaymentLicense(paymentLicenseId: string) {
      const payment = (await this.companiesRepository.findCompanyPaymentLicenseById(paymentLicenseId)) as any;
      if (!payment) return;
      const company = (await this.companiesRepository.findById(payment?.empresaLicenca?.cod_empresa)) as any;
      if (!company) return;

      return this.mailsService.sendMail(company.email_empresa, "confirmedPaymentLicense.html", "Pagamento confirmado", {
         name: company.nome_empresa,
         amount: payment.valor_empresa_licenca_pagamento,
         dueDate: moment(payment.expiracao_empresa_licenca_pagamento).format("DD/MM/YYYY"),
         id: payment.asaas_id,
      });
   }

   async overduePaymentLicense(paymentLicenseId: string) {
      const payment = (await this.companiesRepository.findCompanyPaymentLicenseById(paymentLicenseId)) as any;
      if (!payment) return;
      const company = (await this.companiesRepository.findById(payment?.empresaLicenca?.cod_empresa)) as any;
      if (!company) return;

      return this.mailsService.sendMail(company.email_empresa, "overduePaymentLicense.html", "Fatura vencida", {
         name: company.nome_empresa,
         amount: payment.valor_empresa_licenca_pagamento,
         dueDate: moment(payment.expiracao_empresa_licenca_pagamento).format("DD/MM/YYYY"),
         id: payment.asaas_id,
         url: payment.asaas_url,
      });
   }

   async createdPaymentLicense(paymentLicenseId: string) {
      const payment = (await this.companiesRepository.findCompanyPaymentLicenseById(paymentLicenseId)) as any;
      if (!payment) return;
      const company = (await this.companiesRepository.findById(payment?.empresaLicenca?.cod_empresa)) as any;
      if (!company) return;

      return this.mailsService.sendMail(company.email_empresa, "createdPaymentLicense.html", "Fatura Disponível", {
         name: company.nome_empresa,
         amount: payment.valor_empresa_licenca_pagamento,
         dueDate: moment(payment.expiracao_empresa_licenca_pagamento).format("DD/MM/YYYY"),
         id: payment.asaas_id,
         url: payment.asaas_url,
      });
   }

   async welcomeStudent(name: string, email: string, owner: string) {
      return this.mailsService.sendMail(email, "welcomeStudent.html", "Bem-vindo", {
         name,
         email,
         owner,
      });
   }
}
