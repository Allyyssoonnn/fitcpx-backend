import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { PaymentsRepository } from "../payments/payments.repository";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";

@Module({
   controllers: [AdminController],
   providers: [AdminService, AdminRepository, CompaniesRepository, PaymentsRepository],
})
export class AdminModule {}
