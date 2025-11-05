import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AdminModule } from "./modules/admin/admin.module";
import { CalendarModule } from "./modules/calendar/calendar.module";
import { ChatModule } from "./modules/chat/chat.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { ContractsTemplatesModule } from "./modules/contractsTemplates/contractsTemplates.module";
import { EventsModule } from "./modules/events/events.module";
import { ExercisesModule } from "./modules/exercises/exercises.module";
import { GoogleModule } from "./modules/google/google.module";
import { LicensesModules } from "./modules/licenses/licenses.module";
import { MailsModule } from "./modules/mails/mails.module";
import { MobileModule } from "./modules/mobile/mobile.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { PhysicalAssessmentsModule } from "./modules/physicalAssessments/physicalAssessments.module";
import { PlansModule } from "./modules/plans/plans.module";
import { ServicesModule } from "./modules/services/services.module";
import { StudentsModule } from "./modules/students/students.module";
import { UsersModule } from "./modules/users/users.module";
import { WorkoutsModule } from "./modules/workouts/workouts.module";

@Module({
   providers: [
      {
         provide: APP_GUARD,
         useClass: ThrottlerGuard,
      },
   ],
   imports: [
      ThrottlerModule.forRoot([
         {
            ttl: 60 * 1000, // tempo em milissegundos
            limit: 30,
            name: "default",
         },
      ]),
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
      MobileModule,
      NotificationsModule,
      EventsModule,
      AdminModule,
      ChatModule,
   ],
})
export class AppModule {}
