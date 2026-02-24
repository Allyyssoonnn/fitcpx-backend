import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { EventsService } from "../events/events.service";
import { MailsAPI } from "../mails/mails.api";
import { MailsRepository } from "../mails/mails.repository";
import { MailsService } from "../mails/mails.service";
import { NotificationsAPI } from "../notifications/notifications.api";
import { NotificationsRepository } from "../notifications/notifications.repository";
import { NotificationsService } from "../notifications/notifications.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { WorkoutsController } from "./workouts.controller";
import { WorkoutsRepository } from "./workouts.repository";
import { WorkoutsService } from "./workouts.service";

@Module({
   controllers: [WorkoutsController],
   providers: [
      WorkoutsService,
      WorkoutsRepository,
      NotificationsService,
      NotificationsAPI,
      NotificationsRepository,
      EventsService,
      MailsService,
      MailsRepository,
      MailsAPI,
      CompaniesRepository,
      PaymentsRepository,
   ],
   exports: [WorkoutsService, WorkoutsRepository],
})
export class WorkoutsModule {}
