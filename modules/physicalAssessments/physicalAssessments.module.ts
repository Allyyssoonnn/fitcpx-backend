import { Module } from "@nestjs/common";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { PhysicalAssessmentsController } from "./physicalAssessments.controller";
import { PhysicalAssessmentsRepository } from "./physicalAssessments.repository";
import { PhysicalAssessmentsService } from "./physicalAssessments.service";

@Module({
   controllers: [PhysicalAssessmentsController],
   providers: [PhysicalAssessmentsRepository, PhysicalAssessmentsService, StorageService, StorageAPI],
})
export class PhysicalAssessmentsModule {}
