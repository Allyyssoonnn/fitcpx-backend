import { Module } from "@nestjs/common";
import { ContractsRepository } from "../contracts/contracts.repository";
import { PaymentAPI } from "../payments/payment.api";
import { PaymentService } from "../payments/payment.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { StudentsRepository } from "../students/students.repository";
import { CompaniesController } from "./companies.controller";
import { CompaniesRepository } from "./companies.repository";
import { CompaniesService } from "./companies.service";

@Module({
   controllers: [CompaniesController],
   providers: [
      CompaniesRepository,
      CompaniesService,
      StorageService,
      StorageAPI,
      PaymentService,
      PaymentAPI,
      PaymentsRepository,
      StudentsRepository,
      ContractsRepository,
   ],
})
export class CompaniesModule {}
