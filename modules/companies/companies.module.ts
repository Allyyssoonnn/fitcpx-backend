import { Module } from "@nestjs/common";
import { ContractsRepository } from "../contracts/contracts.repository";
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
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { StudentsRepository } from "../students/students.repository";
import { CompaniesController } from "./companies.controller";
import { CompaniesRepository } from "./companies.repository";
import { CompaniesService } from "./companies.service";

@Module({
   controllers: [CompaniesController],
   providers: [
      CompaniesRepository,
      CompaniesService,
      StorageService,
      StorageAPI,
      PaymentService,
      PaymentAPI,
      PaymentsRepository,
      StudentsRepository,
      ContractsRepository,
      NotificationsService,
      NotificationsAPI,
      NotificationsRepository,
      MailsAPI,
      MailsRepository,
      MailsService,
      EventsService,
   ],
})
export class CompaniesModule {}
