import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { PaymentAPI } from "../payments/payment.api";
import { PaymentService } from "../payments/payment.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { StudentsRepository } from "../students/students.repository";
import { ContractsAPI } from "./contracts.api";
import { ContractsController } from "./contracts.controller";
import { ContractsRepository } from "./contracts.repository";
import { ContractsService } from "./contracts.service";

@Module({
   controllers: [ContractsController],
   providers: [
      ContractsService,
      ContractsAPI,
      ContractsRepository,
      StudentsRepository,
      PaymentService,
      PaymentAPI,
      PaymentsRepository,
      CompaniesRepository,
   ],
})
export class ContractsModule {}
