import { Injectable } from "@nestjs/common";
import { PhysicalAssessmentsRepository } from "./physicalAssessments.repository";

@Injectable()
export class PhysicalAssessmentsService {
   constructor(private readonly physicalAssessmentsRepository: PhysicalAssessmentsRepository) {}

   async getAll(companyId: string, deleted: boolean, studentId?: string) {
      return this.physicalAssessmentsRepository.findAll(companyId, deleted, studentId);
   }
}
