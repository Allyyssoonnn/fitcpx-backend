import { Injectable } from "@nestjs/common";
import { cert, initializeApp } from "firebase-admin/app";
import { getMessaging, MulticastMessage } from "firebase-admin/messaging";
import * as path from "path";

const serviceAccount = path.resolve(__dirname, "keys/fitcpx-e53b3-68d09db2b3ba.json");
const client = initializeApp({
   credential: cert(serviceAccount),
});

@Injectable()
export class NotificationsAPI {
   async sendPushNotification(deviceToken: string[], title: string, message: string) {
      const configs: MulticastMessage = {
         tokens: deviceToken,
         notification: {
            title,
            body: message,
         },
         android: {
            priority: "high",
            notification: {
               channelId: "default_channel",
            },
         },
         apns: {
            payload: {
               aps: {
                  sound: "default",
               },
            },
         },
      };

      return getMessaging(client).sendEachForMulticast(configs);
   }
}
