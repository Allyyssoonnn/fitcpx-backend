import { Injectable } from "@nestjs/common";
import fstat from "fs/promises";
import path from "path";
import { MailsAPI } from "./mails.api";
import { MailsRepository } from "./mails.repository";

@Injectable()
export class MailsService {
   constructor(private readonly mailsAPI: MailsAPI, private readonly mailsRepository: MailsRepository) {}

   async test(email: string) {
      try {
         const resp = await this.mailsAPI.sendMail(email, "Test mail", "Testing...");
         return this.mailsRepository.createOrUpdate({
            content: "Test mail",
            subject: "Testing...",
            status: resp.success ? "sent" : null,
            email,
         });
      } catch (e: any) {
         return this.mailsRepository.createOrUpdate({
            content: "Test mail",
            subject: "Testing...",
            errorMessage: e.message,
            email,
         });
      }
   }

   async sendMail(email: string, templateName: string, subject: string, payload: Record<string, any>) {
      const htmlTemplate = await fstat.readFile(path.join(__dirname, "templates", templateName), "utf-8");
      const html = this.renderTemplate(htmlTemplate, payload);
      try {
         const resp = await this.mailsAPI.sendMail(email, html, subject);
         return this.mailsRepository.createOrUpdate({
            content: html,
            subject: subject,
            status: resp.success ? "sent" : null,
            email,
         });
      } catch (e: any) {
         return this.mailsRepository.createOrUpdate({
            content: html,
            subject: subject,
            errorMessage: e.message,
            status: "failed",
            email,
         });
      }
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

      try {
         const resp = await this.mailsAPI.sendMail(email, htmlBody, "Repasse enviado", [
            {
               filename: "Comprovante.pdf",
               content: proof,
            },
         ]);
         return this.mailsRepository.createOrUpdate({
            content: htmlBody,
            subject: "Repasse enviado",
            status: resp.success ? "sent" : null,
            email,
         });
      } catch (e: any) {
         return this.mailsRepository.createOrUpdate({
            content: htmlBody,
            subject: "Repasse enviado",
            errorMessage: e.message,
            status: "failed",
            email,
         });
      }
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
