import { Module } from "@nestjs/common";
import { NotificationsAPI } from "./notifications.api";
import { NotificationsController } from "./notifications.controller";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationsService } from "./notifications.service";

@Module({
   controllers: [NotificationsController],
   providers: [NotificationsService, NotificationsAPI, NotificationsRepository],
})
export class NotificationsModule {}
