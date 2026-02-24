import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { CompaniesService } from "../companies/companies.service";
import { EventsModule } from "../events/events.module";
import { MailsModule } from "../mails/mails.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PaymentsModule } from "../payments/payments.module";
import { PlansModule } from "../plans/plans.module";
import { StorageModule } from "../storage/storage.module";
import { StudentsRepository } from "../students/students.repository";
import { StudentsService } from "../students/students.service";
import { WorkoutsModule } from "../workouts/workouts.module";
import { ContractsAPI } from "./contracts.api";
import { ContractsController } from "./contracts.controller";
import { ContractsRepository } from "./contracts.repository";
import { ContractsService } from "./contracts.service";

@Module({
   imports: [
      PaymentsModule,
      NotificationsModule,
      MailsModule,
      StorageModule,
      EventsModule,
      WorkoutsModule,
      PlansModule,
   ],
   controllers: [ContractsController],
   providers: [
      ContractsService,
      ContractsAPI,
      ContractsRepository,
      StudentsRepository,
      CompaniesRepository,
      StudentsService,
      CompaniesService,
   ],
   exports: [ContractsService, ContractsRepository],
})
export class ContractsModule {}
