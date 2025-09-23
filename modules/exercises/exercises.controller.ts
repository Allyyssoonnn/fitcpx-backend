import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { ExercisesService } from "./exercises.service";

@Controller("exercises")
export class ExercisesController {
   constructor(private readonly exercisesService: ExercisesService) {}

   @Get()
   async getAll(@CompanyId() cod_empresa: string, @Query("deleted") deleted: string, @Query("lang") lang: string) {
      return this.exercisesService.getAll(cod_empresa, deleted == "true", lang);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.exercisesService.delete(id);
   }

   @Post()
   async createOrUpdate(@Body() body: any) {
      return this.exercisesService.createOrUpdate(body);
   }
}
