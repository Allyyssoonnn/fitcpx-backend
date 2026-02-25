import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { PhysicalAssessmentsController } from "./physicalAssessments.controller";
import { PhysicalAssessmentsRepository } from "./physicalAssessments.repository";
import { PhysicalAssessmentsService } from "./physicalAssessments.service";

@Module({
   imports: [EventsModule],
   controllers: [PhysicalAssessmentsController],
   providers: [PhysicalAssessmentsRepository, PhysicalAssessmentsService],
   exports: [PhysicalAssessmentsService, PhysicalAssessmentsRepository],
})
export class PhysicalAssessmentsModule {}
