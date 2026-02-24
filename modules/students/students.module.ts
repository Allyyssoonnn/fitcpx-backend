import { Module } from "@nestjs/common";
import { CompaniesModule } from "../companies/companies.module";
import { ContractsRepository } from "../contracts/contracts.repository";
import { EventsService } from "../events/events.service";
import { MailsModule } from "../mails/mails.module";
import { NotificationsAPI } from "../notifications/notifications.api";
import { NotificationsRepository } from "../notifications/notifications.repository";
import { NotificationsService } from "../notifications/notifications.service";
import { PaymentAPI } from "../payments/payment.api";
import { PaymentService } from "../payments/payment.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { WorkoutsRepository } from "../workouts/workouts.repository";
import { StudentsController } from "./students.controller";
import { StudentsRepository } from "./students.repository";
import { StudentsService } from "./students.service";

@Module({
   imports: [MailsModule, CompaniesModule],
   controllers: [StudentsController],
   providers: [
      StudentsRepository,
      StudentsService,
      StorageService,
      StorageAPI,
      EventsService,
      PaymentService,
      PaymentAPI,
      PaymentsRepository,
      ContractsRepository,
      NotificationsRepository,
      WorkoutsRepository,
      NotificationsService,
      NotificationsAPI,
   ],
   exports: [StudentsService, StudentsRepository],
})
export class StudentsModule {}
