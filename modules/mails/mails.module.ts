import { Module } from "@nestjs/common";
import { MailsAPI } from "./mails.api";
import { MailsController } from "./mails.controller";
import { MailsRepository } from "./mails.repository";
import { MailsService } from "./mails.service";

@Module({
   controllers: [MailsController],
   providers: [MailsService, MailsAPI, MailsRepository],
   exports: [MailsService, MailsAPI, MailsRepository],
})
export class MailsModule {}
