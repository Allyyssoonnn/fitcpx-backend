import { Body, Controller, Get, Post } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { LicensesService } from "./licenses.service";

@Controller("licenses")
export class LicensesController {
   constructor(private readonly licensesService: LicensesService) {}

   @Get()
   async getLicenses() {
      return this.licensesService.getLicensesAvaliables();
   }

   @Post("buyLicense")
   async buyLicense(@CompanyId() companyId: string, @Body("licenseId") licenseId: string) {
      return this.licensesService.buyLicense(companyId, licenseId);
   }
}
