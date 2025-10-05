import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class NotificationsRepository {
   async createOrUpdate({
      deviceTokenId,
      fcmMessageId,
      event,
      title,
      message,
      status,
      errorMessage,
   }: {
      deviceTokenId: string;
      fcmMessageId?: string | null;
      event?: string | null;
      title: string;
      message: string;
      status?: "pending" | "sent" | "failed" | null;
      errorMessage?: string | null;
   }) {
      return (
         await db.notifications.upsert({
            token: deviceTokenId,
            fcmMessageId,
            event,
            title,
            message,
            status,
            errorMessage,
         })
      )[0];
   }

   getDeviceTokens(studentId: string) {
      return db.device_tokens.findAll({ where: { studentId } });
   }
}
