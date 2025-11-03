import { Controller, Get, Query } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
   constructor(private readonly adminService: AdminService) {}

   @Get("getClientInfo")
   async getClientInfo(@Query("companyId") companyId: string) {
      return this.adminService.getClientInfo(companyId);
   }

   @Get("printPayout")
   async printPayout(@Query("companyId") companyId: string) {
      return this.adminService.printPayout(companyId);
   }

   @Get("getFinanceDashboard")
   async getFinanceDashboard() {
      return this.adminService.getFinanceDashboard();
   }

   @Get("getNewClientsDashboard")
   async getNewClientsDashboard() {
      return this.adminService.getNewClientsDashboard();
   }

   @Get("getLicensesClients")
   async getLicenseClients(@Query("companyId") companyId: string) {
      return this.adminService.getLicensesClients(companyId);
   }

   @SkipThrottle()
   @Get("clients")
   async getClients() {
      return this.adminService.getClients();
   }

   @SkipThrottle()
   @Get("test")
   async test() {
      return "Testado!";
   }
}
