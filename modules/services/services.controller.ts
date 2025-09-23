import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { ServicesService } from "./services.service";

@Controller("services")
export class ServicesController {
   constructor(private readonly servicesService: ServicesService) {}

   @Get()
   async getAll(@CompanyId() companyId: string, @Query("deleted") deleted: string) {
      return this.servicesService.getAll(companyId, deleted == "true");
   }

   @Post()
   async createOrUpdate(@Body() body: any) {
      return this.servicesService.createOrUpdate(body);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.servicesService.delete(id);
   }
}
