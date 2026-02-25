import { Module } from "@nestjs/common";
import { CompaniesModule } from "../companies/companies.module";
import { EventsModule } from "../events/events.module";
import { MailsModule } from "../mails/mails.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PaymentsModule } from "../payments/payments.module";
import { ServicesModule } from "../services/services.module";
import { CalendarController } from "./calendar.controller";
import { CalendarRepository } from "./calendar.repository";
import { CalendarService } from "./calendar.service";

@Module({
   imports: [MailsModule, NotificationsModule, CompaniesModule, PaymentsModule, EventsModule, ServicesModule],
   controllers: [CalendarController],
   providers: [CalendarRepository, CalendarService],
   exports: [CalendarService, CalendarRepository],
})
export class CalendarModule {}
