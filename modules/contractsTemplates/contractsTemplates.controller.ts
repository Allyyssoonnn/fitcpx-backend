import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { ContractsTemplatesService } from "./contractsTemplates.service";

@Controller("contractsTemplates")
export class ContractsTemplatesController {
   constructor(private readonly contractsTemplatesServices: ContractsTemplatesService) {}

   @Get()
   async getAll(@CompanyId() companyId: string, @Query("deleted") deleted: string) {
      return this.contractsTemplatesServices.getAll(companyId, deleted == "true");
   }

   @Post()
   async createOrUpdate(@Body() body: any) {
      return this.contractsTemplatesServices.createOrUpdate(body);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.contractsTemplatesServices.delete(id);
   }
}
