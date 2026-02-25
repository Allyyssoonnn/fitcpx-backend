import { Module } from "@nestjs/common";
import { CalendarModule } from "../calendar/calendar.module";
import { ChatModule } from "../chat/chat.module";
import { CompaniesModule } from "../companies/companies.module";
import { ContractsModule } from "../contracts/contracts.module";
import { ExercisesModule } from "../exercises/exercises.module";
import { MailsModule } from "../mails/mails.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PaymentsModule } from "../payments/payments.module";
import { PhysicalAssessmentsModule } from "../physicalAssessments/physicalAssessments.module";
import { PlansModule } from "../plans/plans.module";
import { StorageModule } from "../storage/storage.module";
import { StudentsModule } from "../students/students.module";
import { WorkoutsModule } from "../workouts/workouts.module";
import { MobileController } from "./mobile.controller";
import { MobileService } from "./mobile.service";

@Module({
   imports: [
      ContractsModule,
      PaymentsModule,
      StorageModule,
      MailsModule,
      NotificationsModule,
      ExercisesModule,
      WorkoutsModule,
      CalendarModule,
      PlansModule,
      CompaniesModule,
      ContractsModule,
      StudentsModule,
      PhysicalAssessmentsModule,
      ChatModule,
   ],
   controllers: [MobileController],
   providers: [MobileService],
})
export class MobileModule {}
