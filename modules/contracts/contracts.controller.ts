import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { UserId } from "../../shared/decorators/userId.decorator";
import { ContractsService } from "./contracts.service";

@Controller("contracts")
export class ContractsController {
   constructor(private readonly contractsService: ContractsService) {}

   @Get()
   async getContracts(@CompanyId() companyId: string, @Query("studentId") studentId: string) {
      return this.contractsService.getContracts(companyId, studentId);
   }

   @Get("getDuePayments")
   async getDuePaymentsDash(@CompanyId() companyId: string) {
      return this.contractsService.getDuePayments(companyId);
   }

   @Get(":id")
   async getContract(@Param("id") id: string) {
      return this.contractsService.getContract(id);
   }

   @Post("onlineContract")
   async onlineContract(@Query("companyId") companyId: string, @Body() body: any) {
      const { student, plan, registerOnly = false } = body;
      return this.contractsService.onlineContract(companyId, student, plan, registerOnly);
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
