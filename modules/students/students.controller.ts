import { Controller, Get, Param, Query } from "@nestjs/common";
import { CompanyId } from "../../decorators/companyId.decorator";
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
}
