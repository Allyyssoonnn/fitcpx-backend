import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { MailsService } from "./mails.service";

@Controller("mails")
export class MailsController {
   constructor(private readonly mailsService: MailsService) {}

   @Get()
   async test(@Query() query: { email: string }) {
      return await this.mailsService.test(query.email);
   }

   @Post("payout")
   @UseInterceptors(
      FileInterceptor("proof", {
         storage: multer.memoryStorage(),
      })
   )
   async payout(
      @Body()
      body: { name: string; email: string; clients: string; amount: string; startDate: string; endDate: string },
      @UploadedFile() fileBuffer: Express.Multer.File
   ) {
      const { name, email, clients, amount, startDate, endDate } = body;
      return await this.mailsService.payout(name, email, clients, amount, fileBuffer.buffer, startDate, endDate);
   }

   @Post("confirmationCode")
   async confirmationCode(
      @Body()
      body: {
         name: string;
         email: string;
         code: string;
      }
   ) {
      const { name, email, code } = body;
      return await this.mailsService.confirmationCode(name, email, code);
   }

   @Post("recoveryPassword")
   async recoveryPassword(
      @Body()
      body: {
         name: string;
         email: string;
         url: string;
      }
   ) {
      const { name, email, url } = body;
      return await this.mailsService.recoveryPassword(name, email, url);
   }

   @Post("dueInvoice")
   async dueInvoice(
      @Body()
      body: {
         name: string;
         email: string;
         url: string;
         description: string;
         dueDate: string;
         amount: string;
         id: string;
         owner: string;
      }
   ) {
      const { name, email, url, description, dueDate, amount, id, owner } = body;
      return await this.mailsService.dueInvoice(name, email, url, description, dueDate, amount, id, owner);
   }
}
