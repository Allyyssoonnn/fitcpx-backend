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
}
