import { Body, Controller, Post } from "@nestjs/common";
import { CompanyId } from "../../decorators/companyId.decorator";
import { UserId } from "../../decorators/userId.decorator";
import { ContractsService } from "./contracts.service";

@Controller("contracts")
export class ContractsController {
   constructor(private readonly contractsService: ContractsService) {}

   @Post("newContract")
   async newContract(@CompanyId() companyId: string, @UserId() userId: string, @Body() body: any) {
      return this.contractsService.newContract(companyId, userId, body);
   }
}
