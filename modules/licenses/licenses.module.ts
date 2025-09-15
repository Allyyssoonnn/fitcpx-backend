import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { CompaniesService } from "../companies/companies.service";
import { ContractsRepository } from "../contracts/contracts.repository";
import { PaymentAPI } from "../payments/payment.api";
import { PaymentService } from "../payments/payment.service";
import { PaymentsRepository } from "../payments/payments.repository";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { StudentsRepository } from "../students/students.repository";
import { LicensesController } from "./licenses.controller";
import { LicensesRepository } from "./licenses.repository";
import { LicensesService } from "./licenses.service";

@Module({
   controllers: [LicensesController],
   providers: [
      LicensesRepository,
      LicensesService,
      CompaniesService,
      CompaniesRepository,
      PaymentService,
      PaymentAPI,
      StorageService,
      StorageAPI,
      PaymentsRepository,
      ContractsRepository,
      StudentsRepository,
   ],
})
export class LicensesModules {}
