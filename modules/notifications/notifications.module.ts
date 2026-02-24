import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { NotificationsAPI } from "./notifications.api";
import { NotificationsController } from "./notifications.controller";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationsService } from "./notifications.service";

@Module({
   controllers: [NotificationsController],
   providers: [NotificationsService, NotificationsAPI, NotificationsRepository, CompaniesRepository],
   exports: [NotificationsService, NotificationsRepository],
})
export class NotificationsModule {}
