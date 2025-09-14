import { Controller, Get, Headers, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import multer from "multer";
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

   @Post("updateImagePhysicalAssessment")
   @UseInterceptors(
      FilesInterceptor("image", 10, {
         storage: multer.memoryStorage(),
      })
   )
   async updateImageUser(@Headers() headers: any, @UploadedFiles() filesBuffer: Express.Multer.File[]) {
      const { cod_avaliacao, deletedImages } = headers;
      return this.physicalAssessmentsService.updateImagePhysicalAssessment(cod_avaliacao, filesBuffer, deletedImages);
   }
}
