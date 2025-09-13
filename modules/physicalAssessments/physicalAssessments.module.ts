import { Module } from "@nestjs/common";
import { PhysicalAssessmentsController } from "./physicalAssessments.controller";
import { PhysicalAssessmentsRepository } from "./physicalAssessments.repository";
import { PhysicalAssessmentsService } from "./physicalAssessments.service";

@Module({
   controllers: [PhysicalAssessmentsController],
   providers: [PhysicalAssessmentsRepository, PhysicalAssessmentsService],
})
export class PhysicalAssessmentsModule {}
