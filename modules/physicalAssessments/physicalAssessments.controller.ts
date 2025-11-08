import {
   Body,
   Controller,
   Delete,
   Get,
   Headers,
   HttpException,
   Param,
   Post,
   Query,
   Response,
   UploadedFiles,
   UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { PhysicalAssessmentsService } from "./physicalAssessments.service";

@Controller("physicalAssessments")
export class PhysicalAssessmentsController {
   constructor(private readonly physicalAssessmentsService: PhysicalAssessmentsService) {}

   @Get("fitnessassessmentpdf")
   async getTemplatePrint(@Response() res: any) {
      return res.sendFile(__dirname + "/templates/fitnessassessmentpdf.html");
   }

   @Get()
   async getAll(
      @CompanyId() companyId: string,
      @Query("studentId") studentId?: string,
      @Query("deleted") deleted?: string
   ) {
      return this.physicalAssessmentsService.getAll(companyId, deleted == "true", studentId);
   }

   @Post()
   async createOrUpdate(@Body() body: any) {
      return this.physicalAssessmentsService.createOrUpdate(body);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.physicalAssessmentsService.delete(id);
   }

   @Post("updateImagePhysicalAssessment")
   @UseInterceptors(
      FilesInterceptor("image", 30, {
         storage: multer.memoryStorage(),
      })
   )
   async updateImageUser(
      @Headers() headers: any,
      @UploadedFiles() filesBuffer: Express.Multer.File[],
      @Query("physicalId") physicalId: string
   ) {
      const { deletedimages } = headers;
      if (!physicalId) {
         throw new HttpException("Erro - ID da avaliação não recebido", 403);
      }
      return this.physicalAssessmentsService.updateImagePhysicalAssessment(physicalId, filesBuffer, deletedimages);
   }
}
