import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { ContractsRepository } from "../contracts/contracts.repository";
import { EventsService } from "../events/events.service";
import { MailsModule } from "../mails/mails.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { StudentsRepository } from "../students/students.repository";
import { PaymentAPI } from "./payment.api";
import { PaymentService } from "./payment.service";
import { PaymentsController } from "./payments.controller";
import { PaymentsRepository } from "./payments.repository";

@Module({
   imports: [MailsModule, NotificationsModule],
   controllers: [PaymentsController],
   providers: [
      PaymentService,
      PaymentsRepository,
      PaymentAPI,
      StudentsRepository,
      ContractsRepository,
      EventsService,
      CompaniesRepository,
   ],
   exports: [PaymentService, PaymentsRepository, PaymentAPI],
})
export class PaymentsModule {}
