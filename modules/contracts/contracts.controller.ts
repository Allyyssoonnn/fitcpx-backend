import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../decorators/companyId.decorator";
import { UserId } from "../../decorators/userId.decorator";
import { ContractsService } from "./contracts.service";

@Controller("contracts")
export class ContractsController {
   constructor(private readonly contractsService: ContractsService) {}

   @Get()
   async getContracts(@CompanyId() companyId: string, @Query("studentId") studentId: string) {
      return this.contractsService.getContracts(companyId, studentId);
   }

   @Get(":id")
   async getContract(@Param("id") id: string) {
      return this.contractsService.getContract(id);
   }

   @Post("newContract")
   async newContract(@CompanyId() companyId: string, @UserId() userId: string, @Body() body: any) {
      return this.contractsService.newContract(companyId, userId, body);
   }

   @Post("downloadContract")
   async downloadContract(@Body() body: any) {
      const { documentId, signed } = body;
      return this.contractsService.downloadContract(documentId, signed);
   }

   @Delete(":id")
   async cancelContract(@Param("id") id: string) {
      return this.contractsService.cancelContract(id);
   }
}
