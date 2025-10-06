import { Injectable } from "@nestjs/common";
import { NotificationsAPI } from "./notifications.api";
import { NotificationsRepository } from "./notifications.repository";

@Injectable()
export class NotificationsService {
   constructor(
      private readonly notificationsAPI: NotificationsAPI,
      private readonly notificationsRepository: NotificationsRepository
   ) {}

   async test(deviceToken: string) {
      try {
         const response = await this.notificationsAPI.sendPushNotification(
            [deviceToken],
            "Olá",
            "Testando notificações"
         );
         return this.notificationsRepository.createOrUpdate({
            deviceTokenId: deviceToken,
            fcmMessageId: response?.responses[0].messageId ?? null,
            title: "Olá",
            message: "Testando notificações",
            event: "test",
            status: "sent",
         });
      } catch (e: any) {
         return this.notificationsRepository.createOrUpdate({
            deviceTokenId: deviceToken,
            title: "Olá",
            message: "Testando notificações",
            event: "test",
            status: "failed",
            errorMessage: e.message,
         });
      }
   }

   async sendPushNotification(title: string, message: string, event: string, studentId: string) {
      const devices = await this.notificationsRepository.getDeviceTokens(studentId);
      const tokens = devices.map((d: any) => d.token);
      const sendTokens = tokens.filter((token: any, i: number) => tokens.indexOf(token) === i) as any;

      try {
         const response = await this.notificationsAPI.sendPushNotification(sendTokens, title, message);
         for (let i = 0; i < sendTokens.length; i++) {
            const token = tokens[i];
            const result = response.responses[i];

            await this.notificationsRepository.createOrUpdate({
               deviceTokenId: token,
               fcmMessageId: result.success ? result.messageId : null,
               title,
               message,
               event,
               status: result.success ? "sent" : "failed",
               errorMessage: result.success ? null : result.error?.message,
            });
         }

         return { successCount: response.successCount, failureCount: response.failureCount };
      } catch (e: any) {
         for (const token of tokens) {
            await this.notificationsRepository.createOrUpdate({
               deviceTokenId: token,
               title,
               message,
               event,
               status: "failed",
               errorMessage: e.message,
            });
         }

         return { successCount: 0, failureCount: tokens.length };
      }
   }
}
