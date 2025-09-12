import { Module } from "@nestjs/common";
import { MailsAPI } from "../mails/mails.api";
import { MailsService } from "../mails/mails.service";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
   controllers: [UsersController],
   providers: [UsersRepository, UsersService, MailsService, MailsAPI],
})
export class UsersModule {}
