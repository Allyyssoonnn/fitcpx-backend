import { Module } from "@nestjs/common";
import { ContractsRepository } from "../contracts/contracts.repository";
import { StudentsRepository } from "../students/students.repository";
import { PaymentAPI } from "./payment.api";
import { PaymentService } from "./payment.service";
import { PaymentsController } from "./payments.controller";
import { PaymentsRepository } from "./payments.repository";

@Module({
   controllers: [PaymentsController],
   providers: [PaymentService, PaymentsRepository, PaymentAPI, StudentsRepository, ContractsRepository],
})
export class PaymentsModule {}
