import { Body, Controller, Get, Post } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { UserId } from "../../shared/decorators/userId.decorator";
import { LicensesService } from "./licenses.service";

@Controller("licenses")
export class LicensesController {
   constructor(private readonly licensesService: LicensesService) {}

   @Get()
   async getLicenses(@CompanyId() companyId: string) {
      return this.licensesService.getLicensesAvaliables(companyId);
   }

   @Post("buyLicense")
   async buyLicense(@CompanyId() companyId: string, @Body("licenseId") licenseId: string, @UserId() userId: string) {
      return this.licensesService.buyLicense(companyId, licenseId, userId);
   }

   @Post("sendCoupon")
   async sendCoupon(@CompanyId() companyId: string, @Body("coupon") coupon: string) {
      return this.licensesService.sendCoupon(companyId, coupon);
   }
}
