import { Module } from "@nestjs/common";
import { CompaniesModule } from "../companies/companies.module";
import { ContractsModule } from "../contracts/contracts.module";
import { EventsModule } from "../events/events.module";
import { LicensesModules } from "../licenses/licenses.module";
import { MailsModule } from "../mails/mails.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PaymentsModule } from "../payments/payments.module";
import { PhysicalAssessmentsModule } from "../physicalAssessments/physicalAssessments.module";
import { StorageModule } from "../storage/storage.module";
import { StudentsModule } from "../students/students.module";
import { WorkoutsModule } from "../workouts/workouts.module";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";

@Module({
   imports: [
      NotificationsModule,
      MailsModule,
      StorageModule,
      PaymentsModule,
      CompaniesModule,
      StudentsModule,
      LicensesModules,
      EventsModule,
      WorkoutsModule,
      ContractsModule,
      PhysicalAssessmentsModule,
   ],
   controllers: [AdminController],
   providers: [AdminService, AdminRepository],
   exports: [AdminService],
})
export class AdminModule {}
