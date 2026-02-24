import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { CompaniesService } from "../companies/companies.service";
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
import { WorkoutsRepository } from "../workouts/workouts.repository";
import { LicensesController } from "./licenses.controller";
import { LicensesRepository } from "./licenses.repository";
import { LicensesService } from "./licenses.service";

@Module({
   controllers: [LicensesController],
   providers: [
      LicensesRepository,
      LicensesService,
      CompaniesService,
      CompaniesRepository,
      WorkoutsRepository,
      PaymentService,
      PaymentAPI,
      StorageService,
      StorageAPI,
      PaymentsRepository,
      ContractsRepository,
      StudentsRepository,
      NotificationsService,
      NotificationsAPI,
      NotificationsRepository,
      MailsAPI,
      MailsRepository,
      MailsService,
      EventsService,
   ],
   exports: [LicensesService, LicensesRepository],
})
export class LicensesModules {}
