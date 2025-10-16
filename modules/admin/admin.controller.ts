import { Controller, Get, Query } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
   constructor(private readonly adminService: AdminService) {}

   @Get("printPayout")
   async printPayout(@Query("companyId") companyId: string) {
      return this.adminService.printPayout(companyId);
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
