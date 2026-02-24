import { Module } from "@nestjs/common";
import { ContractsModule } from "../contracts/contracts.module";
import { EventsModule } from "../events/events.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PaymentsModule } from "../payments/payments.module";
import { StorageModule } from "../storage/storage.module";
import { WorkoutsModule } from "../workouts/workouts.module";
import { CompaniesController } from "./companies.controller";
import { CompaniesRepository } from "./companies.repository";
import { CompaniesService } from "./companies.service";

@Module({
   imports: [NotificationsModule, PaymentsModule, EventsModule, StorageModule, ContractsModule, WorkoutsModule],
   controllers: [CompaniesController],
   providers: [CompaniesRepository, CompaniesService],
   exports: [CompaniesService, CompaniesRepository],
})
export class CompaniesModule {}
