import { Controller, Get, Query } from "@nestjs/common";
import { CompanyId } from "../../decorators/companyId.decorator";
import { PhysicalAssessmentsService } from "./physicalAssessments.service";

@Controller("physicalAssessments")
export class PhysicalAssessmentsController {
   constructor(private readonly physicalAssessmentsService: PhysicalAssessmentsService) {}

   @Get()
   async getAll(
      @CompanyId() companyId: string,
      @Query("studentId") studentId?: string,
      @Query("deleted") deleted?: string
   ) {
      return this.physicalAssessmentsService.getAll(companyId, deleted == "true", studentId);
   }
}
