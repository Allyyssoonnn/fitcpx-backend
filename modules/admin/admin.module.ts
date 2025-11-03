import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { ContractsRepository } from "../contracts/contracts.repository";
import { PaymentsRepository } from "../payments/payments.repository";
import { PhysicalAssessmentsRepository } from "../physicalAssessments/physicalAssessments.repository";
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
      CompaniesRepository,
      PaymentsRepository,
      StudentsRepository,
      PhysicalAssessmentsRepository,
      WorkoutsRepository,
      ContractsRepository,
   ],
})
export class AdminModule {}
