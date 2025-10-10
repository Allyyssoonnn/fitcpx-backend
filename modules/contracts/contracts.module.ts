import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { EventsService } from "../events/events.service";
import { MailsAPI } from "../mails/mails.api";
import { MailsRepository } from "../mails/mails.repository";
import { MailsService } from "../mails/mails.service";
import { NotificationsAPI } from "../notifications/notifications.api";
import { NotificationsRepository } from "../notifications/notifications.repository";
import { NotificationsService } from "../notifications/notifications.service";
import { PaymentAPI } from "../payments/payment.api";
import { PaymentService } from "../payments/payment.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { StudentsRepository } from "../students/students.repository";
import { ContractsAPI } from "./contracts.api";
import { ContractsController } from "./contracts.controller";
import { ContractsRepository } from "./contracts.repository";
import { ContractsService } from "./contracts.service";

@Module({
   controllers: [ContractsController],
   providers: [
      ContractsService,
      ContractsAPI,
      ContractsRepository,
      StudentsRepository,
      PaymentService,
      PaymentAPI,
      PaymentsRepository,
      CompaniesRepository,
      NotificationsService,
      NotificationsAPI,
      NotificationsRepository,
      EventsService,
      MailsAPI,
      MailsRepository,
      MailsService,
   ],
})
export class ContractsModule {}
