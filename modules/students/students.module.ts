import { Module } from "@nestjs/common";
import { CompaniesModule } from "../companies/companies.module";
import { MailsModule } from "../mails/mails.module";
import { StorageModule } from "../storage/storage.module";
import { StudentsController } from "./students.controller";
import { StudentsRepository } from "./students.repository";
import { StudentsService } from "./students.service";

@Module({
   imports: [MailsModule, CompaniesModule, StorageModule],
   controllers: [StudentsController],
   providers: [StudentsRepository, StudentsService],
   exports: [StudentsService, StudentsRepository],
})
export class StudentsModule {}
