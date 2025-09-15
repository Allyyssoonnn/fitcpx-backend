import { Module } from "@nestjs/common";
import { CompaniesModule } from "./modules/companies/companies.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { GoogleModule } from "./modules/google/google.module";
import { MailsModule } from "./modules/mails/mails.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { PhysicalAssessmentsModule } from "./modules/physicalAssessments/physicalAssessments.module";
import { StudentsModule } from "./modules/students/students.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
   imports: [
      UsersModule,
      CompaniesModule,
      StudentsModule,
      MailsModule,
      GoogleModule,
      PhysicalAssessmentsModule,
      ContractsModule,
      PaymentsModule,
   ],
})
export class AppModule {}
