import { Module } from "@nestjs/common";
import { ChatRepository } from "../chat/chat.repository";
import { CompaniesRepository } from "../companies/companies.repository";
import { CompaniesService } from "../companies/companies.service";
import { ContractsAPI } from "../contracts/contracts.api";
import { ContractsRepository } from "../contracts/contracts.repository";
import { ContractsService } from "../contracts/contracts.service";
import { EventsService } from "../events/events.service";
import { ExercisesRepository } from "../exercises/exercises.repository";
import { ExercisesService } from "../exercises/exercises.service";
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
import { PhysicalAssessmentsService } from "../physicalAssessments/physicalAssessments.service";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { StudentsRepository } from "../students/students.repository";
import { StudentsService } from "../students/students.service";
import { WorkoutsRepository } from "../workouts/workouts.repository";
import { WorkoutsService } from "../workouts/workouts.service";
import { MobileController } from "./mobile.controller";
import { MobileService } from "./mobile.service";

@Module({
   controllers: [MobileController],
   providers: [
      MobileService,
      StudentsService,
      StudentsRepository,
      StorageService,
      StorageAPI,
      CompaniesService,
      CompaniesRepository,
      PaymentService,
      PaymentAPI,
      PaymentsRepository,
      ContractsRepository,
      ExercisesService,
      ExercisesRepository,
      PhysicalAssessmentsService,
      PhysicalAssessmentsRepository,
      WorkoutsService,
      WorkoutsRepository,
      ContractsService,
      ContractsRepository,
      ContractsAPI,
      EventsService,
      MailsService,
      MailsAPI,
      MailsRepository,
      NotificationsService,
      NotificationsAPI,
      NotificationsRepository,
      ChatRepository,
   ],
})
export class MobileModule {}
