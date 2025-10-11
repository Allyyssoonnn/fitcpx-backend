import { Controller, Get, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
   constructor(private readonly adminService: AdminService) {}

   @Get("printPayout")
   async printPayout(@Query("companyId") companyId: string) {
      return this.adminService.printPayout(companyId);
   }
}
