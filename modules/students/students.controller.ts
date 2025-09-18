import {
   Body,
   Controller,
   Delete,
   Get,
   Headers,
   Param,
   Post,
   Query,
   UploadedFile,
   UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { StudentsService } from "./students.service";

@Controller("students")
export class StudentsController {
   constructor(private readonly studentsService: StudentsService) {}

   @Get()
   async getAll(@CompanyId() cod_empresa: string, @Query("deleted") deleted: string) {
      return await this.studentsService.getAll(cod_empresa, deleted == "true");
   }

   @Get(":id")
   async getById(@Param("id") id: string, @CompanyId() cod_empresa: string) {
      return await this.studentsService.getById(id, cod_empresa);
   }

   @Post()
   async createOrUpdate(@Body() body: any) {
      return this.studentsService.createOrUpdate(body);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.studentsService.delete(id);
   }

   @Post("updateImageStudent")
   @UseInterceptors(
      FileInterceptor("image", {
         storage: multer.memoryStorage(),
      })
   )
   async updateImageUser(@Headers() header: any, @UploadedFile() fileBuffer: Express.Multer.File) {
      const { cod_aluno } = header;
      return this.studentsService.updateImageUser(cod_aluno, fileBuffer);
   }
}
