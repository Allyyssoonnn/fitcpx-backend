import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { CompaniesService } from "../companies/companies.service";
import { ContractsRepository } from "../contracts/contracts.repository";
import { EventsService } from "../events/events.service";
import { LicensesRepository } from "../licenses/licenses.repository";
import { LicensesService } from "../licenses/licenses.service";
import { MailsAPI } from "../mails/mails.api";
import { MailsRepository } from "../mails/mails.repository";
import { MailsService } from "../mails/mails.service";
import { NotificationsAPI } from "../notifications/notifications.api";
import { NotificationsRepository } from "../notifications/notifications.repository";
import { NotificationsService } from "../notifications/notifications.service";
import { PaymentAPI } from "../payments/payment.api";
import { PaymentService } from "../payments/payment.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { PhysicalAssessmentsRepository } from "../physicalAssessments/physicalAssessments.repository";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { StudentsRepository } from "../students/students.repository";
import { WorkoutsRepository } from "../workouts/workouts.repository";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";

@Module({
   controllers: [AdminController],
   providers: [
      AdminService,
      AdminRepository,
      CompaniesService,
      CompaniesRepository,
      PaymentAPI,
      PaymentService,
      PaymentsRepository,
      StudentsRepository,
      PhysicalAssessmentsRepository,
      WorkoutsRepository,
      ContractsRepository,
      LicensesService,
      LicensesRepository,
      StorageAPI,
      StorageService,
      EventsService,
      MailsService,
      MailsRepository,
      MailsAPI,
      NotificationsService,
      NotificationsAPI,
      NotificationsRepository,
   ],
})
export class AdminModule {}
