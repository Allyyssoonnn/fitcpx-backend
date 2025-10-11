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
import { ServicesRepository } from "../services/services.repository";
import { CalendarController } from "./calendar.controller";
import { CalendarRepository } from "./calendar.repository";
import { CalendarService } from "./calendar.service";

@Module({
   controllers: [CalendarController],
   providers: [
      CalendarRepository,
      CalendarService,
      ServicesRepository,
      EventsService,
      MailsAPI,
      MailsService,
      MailsRepository,
      NotificationsAPI,
      NotificationsService,
      NotificationsRepository,
      CompaniesRepository,
      PaymentsRepository,
   ],
})
export class CalendarModule {}
