import { Module } from "@nestjs/common";
import { MailsAPI } from "../mails/mails.api";
import { MailsRepository } from "../mails/mails.repository";
import { MailsService } from "../mails/mails.service";
import { NotificationsAPI } from "../notifications/notifications.api";
import { NotificationsRepository } from "../notifications/notifications.repository";
import { NotificationsService } from "../notifications/notifications.service";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
   controllers: [EventsController],
   providers: [
      EventsService,
      MailsService,
      MailsAPI,
      MailsRepository,
      NotificationsService,
      NotificationsAPI,
      NotificationsRepository,
   ],
})
export class EventsModule {}
