import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { MailsAPI } from "../mails/mails.api";
import { MailsService } from "../mails/mails.service";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
   controllers: [UsersController],
   providers: [UsersRepository, UsersService, MailsService, MailsAPI, StorageService, StorageAPI, CompaniesRepository],
})
export class UsersModule {}
