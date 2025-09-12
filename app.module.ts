import { Module } from "@nestjs/common";
import { CompaniesModule } from "./modules/companies/companies.module";
import { MailsModule } from "./modules/mails/mails.module";
import { StudentsModule } from "./modules/students/students.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
   imports: [UsersModule, CompaniesModule, StudentsModule, MailsModule],
})
export class AppModule {}
