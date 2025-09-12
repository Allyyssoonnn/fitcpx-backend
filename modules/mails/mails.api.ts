import { Injectable } from "@nestjs/common";
import { MailtrapClient } from "mailtrap";
const { createTransport } = require("nodemailer");
const dev = process.env.NODE_ENV !== "production";

var transport = createTransport({
   host: "sandbox.smtp.mailtrap.io",
   port: 2525,
   auth: {
      user: "401cacb4d09d10",
      pass: "8a1224b4df3c7a",
   },
});

const TOKEN = "[REDACTED_CREDENTIAL]";

const client = new MailtrapClient({
   token: TOKEN,
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

      if (dev) {
         return transport.sendMail({
            from: `"${this.name}" <${email}>`,
            to: email,
            subject,
            html,
            attachments,
         });
      }

      return client
         .send({
            from: { email: this.sender, name: this.name },
            to: recipients,
            subject,
            html,
            category: "FitCpx App",
            attachments,
         })
         .then(console.log, console.error);
   }
}
