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
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
   controllers: [UsersController],
   providers: [
      UsersRepository,
      UsersService,
      MailsService,
      MailsAPI,
      StorageService,
      StorageAPI,
      CompaniesRepository,
      MailsRepository,
      EventsService,
      NotificationsAPI,
      NotificationsService,
      NotificationsRepository,
      PaymentsRepository,
   ],
})
export class UsersModule {}
