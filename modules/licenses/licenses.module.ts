import { Module } from "@nestjs/common";
import { CompaniesModule } from "../companies/companies.module";
import { ContractsModule } from "../contracts/contracts.module";
import { EventsModule } from "../events/events.module";
import { MailsModule } from "../mails/mails.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PaymentsModule } from "../payments/payments.module";
import { StorageModule } from "../storage/storage.module";
import { StudentsModule } from "../students/students.module";
import { WorkoutsModule } from "../workouts/workouts.module";
import { LicensesController } from "./licenses.controller";
import { LicensesRepository } from "./licenses.repository";
import { LicensesService } from "./licenses.service";

@Module({
   imports: [
      StorageModule,
      PaymentsModule,
      NotificationsModule,
      MailsModule,
      WorkoutsModule,
      ContractsModule,
      EventsModule,
      StudentsModule,
      CompaniesModule,
   ],
   controllers: [LicensesController],
   providers: [LicensesRepository, LicensesService],
   exports: [LicensesService, LicensesRepository],
})
export class LicensesModules {}
