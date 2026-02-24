import { Module } from "@nestjs/common";
import { ServicesModule } from "../services/services.module";
import { PlansController } from "./plans.controller";
import { PlansRepository } from "./plans.repository";
import { PlansService } from "./plans.service";

@Module({
   imports: [ServicesModule],
   controllers: [PlansController],
   providers: [PlansRepository, PlansService],
   exports: [PlansService, PlansRepository],
})
export class PlansModule {}
