import { Injectable } from "@nestjs/common";
import { MailtrapClient } from "mailtrap";
const dev = process.env.NODE_ENV !== "production";

const TOKEN = "[REDACTED_CREDENTIAL]";
const sandboxTOKEN = "[REDACTED_CREDENTIAL]";

const client = new MailtrapClient({
   token: dev ? sandboxTOKEN : TOKEN,
   sandbox: dev,
   testInboxId: 4010372,
});

@Injectable()
export class MailsAPI {
   constructor() {
      this.token = TOKEN;
      this.sender = "noreply@fitcpx.com";
      this.name = "Lab Complex Dev LTDA";
   }

   token: string;
   sender: string;
   name: string;

   async sendMail(email: string, html?: string, subject: string = "", attachments?: any) {
      const recipients = [{ email }];

      return await client.send({
         from: { email: this.sender, name: this.name },
         to: recipients,
         subject,
         html,
         category: "FitCpx App",
         attachments,
      });
   }
}
