import { Module } from "@nestjs/common";
import { MailsAPI } from "./mails.api";
import { MailsController } from "./mails.controller";
import { MailsService } from "./mails.service";

@Module({
   controllers: [MailsController],
   providers: [MailsService, MailsAPI],
})
export class MailsModule {}
