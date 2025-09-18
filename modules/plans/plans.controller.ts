import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { PlansService } from "./plans.service";

@Controller("plans")
export class PlansController {
   constructor(private readonly plansService: PlansService) {}

   @Get()
   async getAll(@CompanyId() cod_empresa: string, @Query("deleted") deleted: string) {
      return await this.plansService.getAll(cod_empresa, deleted == "true");
   }

   @Post()
   async createPlan(@Body() body: any) {
      const { plano, modalidades } = body;
      return this.plansService.createPlan(plano, modalidades);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.plansService.delete(id);
   }
}
