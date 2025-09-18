import { Module } from "@nestjs/common";
import { ServicesRepository } from "../services/services.repository";
import { ServicesService } from "../services/services.service";
import { PlansController } from "./plans.controller";
import { PlansRepository } from "./plans.repository";
import { PlansService } from "./plans.service";

@Module({
   controllers: [PlansController],
   providers: [PlansRepository, PlansService, ServicesService, ServicesRepository],
})
export class PlansModule {}
