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
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { PhysicalAssessmentsController } from "./physicalAssessments.controller";
import { PhysicalAssessmentsRepository } from "./physicalAssessments.repository";
import { PhysicalAssessmentsService } from "./physicalAssessments.service";

@Module({
   controllers: [PhysicalAssessmentsController],
   providers: [
      PhysicalAssessmentsRepository,
      PhysicalAssessmentsService,
      StorageService,
      StorageAPI,
      NotificationsService,
      NotificationsAPI,
      NotificationsRepository,
      EventsService,
      MailsAPI,
      MailsRepository,
      MailsService,
      CompaniesRepository,
      PaymentsRepository,
   ],
   exports: [PhysicalAssessmentsService, PhysicalAssessmentsRepository],
})
export class PhysicalAssessmentsModule {}
