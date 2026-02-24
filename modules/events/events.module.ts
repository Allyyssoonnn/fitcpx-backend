import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { MailsModule } from "../mails/mails.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PaymentsModule } from "../payments/payments.module";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
   imports: [MailsModule, NotificationsModule, PaymentsModule],
   controllers: [EventsController],
   providers: [EventsService, CompaniesRepository],
   exports: [EventsService],
})
export class EventsModule {}
