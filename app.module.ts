import { Module } from "@nestjs/common";
import { CalendarModule } from "./modules/calendar/calendar.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { ContractsTemplatesModule } from "./modules/contractsTemplates/contractsTemplates.module";
import { ExercisesModule } from "./modules/exercises/exercises.module";
import { GoogleModule } from "./modules/google/google.module";
import { LicensesModules } from "./modules/licenses/licenses.module";
import { MailsModule } from "./modules/mails/mails.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { PhysicalAssessmentsModule } from "./modules/physicalAssessments/physicalAssessments.module";
import { PlansModule } from "./modules/plans/plans.module";
import { ServicesModule } from "./modules/services/services.module";
import { StudentsModule } from "./modules/students/students.module";
import { UsersModule } from "./modules/users/users.module";
import { WorkoutsModule } from "./modules/workouts/workouts.module";

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
      CalendarModule,
      LicensesModules,
      PlansModule,
      ServicesModule,
      ContractsTemplatesModule,
      WorkoutsModule,
      ExercisesModule,
   ],
})
export class AppModule {}
