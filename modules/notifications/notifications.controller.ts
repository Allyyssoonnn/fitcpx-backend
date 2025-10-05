import { Controller, Get, Query } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
   constructor(private readonly notificationService: NotificationsService) {}

   @Get()
   async test(@Query("token") deviceToken: string) {
      return this.notificationService.test(deviceToken);
   }
}
