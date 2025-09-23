import { Injectable } from "@nestjs/common";
import fstat from "fs/promises";
import path from "path";
import { MailsAPI } from "./mails.api";

@Injectable()
export class MailsService {
   constructor(private readonly mailsAPI: MailsAPI) {}

   async test(email: string) {
      return this.mailsAPI.sendMail(email);
   }

   private renderTemplate(template: string, variables: any) {
      let output = template;
      for (const [key, value] of Object.entries(variables)) {
         const regex = new RegExp(`{{${key}}}`, "g");
         output = output.replace(regex, String(value));
      }
      return output;
   }

   async payout(
      name: string,
      email: string,
      clients: string,
      amount: string,
      proof: Buffer,
      startDate: string,
      endDate: string
   ) {
      const htmlTemplate = await fstat.readFile(path.join(__dirname, "templates", "payout.html"), "utf-8");
      const clientsObj = JSON.parse(clients);
      const htmlClients = clientsObj
         .map(
            (client: any) => `
         <tr>
            <td>${client.name}</td>
            <td>${client.date}</td>
            <td>${client.amount}</td>
         </tr>
      `
         )
         .join("");
      const htmlBody = this.renderTemplate(htmlTemplate, { name, amount, startDate, endDate, clients: htmlClients });

      return this.mailsAPI.sendMail(email, htmlBody, "Repasse enviado", [
         {
            filename: "Comprovante.pdf",
            content: proof,
         },
      ]);
   }

   async confirmationCode(name: string, email: string, code: string) {
      const htmlTemplate = await fstat.readFile(path.join(__dirname, "templates", "confirmationCode.html"), "utf-8");
      const htmlBody = this.renderTemplate(htmlTemplate, { name, code });

      return this.mailsAPI.sendMail(email, htmlBody, "Código de confirmação");
   }

   async recoveryPassword(name: string, email: string, url: string) {
      const htmlTemplate = await fstat.readFile(path.join(__dirname, "templates", "recoveryPassword.html"), "utf-8");
      const htmlBody = this.renderTemplate(htmlTemplate, { name, email, url });

      return this.mailsAPI.sendMail(email, htmlBody, "Recuperação de senha");
   }

   async dueInvoice(
      name: string,
      email: string,
      url: string,
      description: string,
      dueDate: string,
      amount: string,
      id: string,
      owner: string
   ) {
      const htmlTemplate = await fstat.readFile(path.join(__dirname, "templates", "dueInvoice.html"), "utf-8");
      const htmlBody = this.renderTemplate(htmlTemplate, { name, email, url, description, dueDate, amount, id, owner });

      return this.mailsAPI.sendMail(email, htmlBody, "Recuperação de senha");
   }
}
