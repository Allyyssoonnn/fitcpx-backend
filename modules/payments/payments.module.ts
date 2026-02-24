import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { ContractsRepository } from "../contracts/contracts.repository";
import { EventsService } from "../events/events.service";
import { MailsAPI } from "../mails/mails.api";
import { MailsRepository } from "../mails/mails.repository";
import { MailsService } from "../mails/mails.service";
import { NotificationsAPI } from "../notifications/notifications.api";
import { NotificationsRepository } from "../notifications/notifications.repository";
import { NotificationsService } from "../notifications/notifications.service";
import { StudentsRepository } from "../students/students.repository";
import { PaymentAPI } from "./payment.api";
import { PaymentService } from "./payment.service";
import { PaymentsController } from "./payments.controller";
import { PaymentsRepository } from "./payments.repository";

@Module({
   controllers: [PaymentsController],
   providers: [
      PaymentService,
      PaymentsRepository,
      PaymentAPI,
      StudentsRepository,
      ContractsRepository,
      NotificationsRepository,
      NotificationsAPI,
      NotificationsService,
      EventsService,
      MailsRepository,
      MailsService,
      MailsAPI,
      CompaniesRepository,
   ],
   exports: [PaymentService, PaymentsRepository, PaymentAPI],
})
export class PaymentsModule {}
