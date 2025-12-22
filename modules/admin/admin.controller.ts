import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { LicensesService } from "../licenses/licenses.service";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
   constructor(private readonly adminService: AdminService, private readonly licensesService: LicensesService) {}

   @Post("createOrEditLicenses")
   async createOrEditLicenses(@Body("license") license: any) {
      return this.adminService.createOrEditLicenses(license);
   }

   @Get("getLicenses")
   async getLicenses() {
      return this.adminService.getLicenses();
   }

   @Get("getRefreshTokens")
   async getRefreshTokens(@Query("date") date: string) {
      return this.adminService.getRefreshTokens(date);
   }

   @Get("getClientInfo")
   async getClientInfo(@Query("companyId") companyId: string) {
      return this.adminService.getClientInfo(companyId);
   }

   @Get("printPayout")
   async printPayout(
      @Query("companyId") companyId: string,
      @Query("startDate") startDate: string,
      @Query("endDate") endDate: string
   ) {
      return this.adminService.printPayout(companyId, startDate, endDate);
   }

   @Get("getFinanceDashboard")
   async getFinanceDashboard() {
      return this.adminService.getFinanceDashboard();
   }

   @Get("getClientsCount")
   async getClientsCount() {
      return this.adminService.getClientsCount();
   }

   @Get("getNewClientsDashboard")
   async getNewClientsDashboard(@Query("year") year: string) {
      return this.adminService.getNewClientsDashboard(year ? Number(year) : undefined);
   }

   @Get("getLicensesClients")
   async getLicenseClients(@Query("companyId") companyId: string) {
      return this.adminService.getLicensesClients(companyId);
   }

   @Get("getClient")
   async getClient(@Query("companyId") companyId: string) {
      return this.adminService.getClient(companyId);
   }

   @Get("sendCoupon")
   async sendCoupon(@Query("companyId") companyId: string, @Query("coupon") coupon: string) {
      return this.licensesService.sendCoupon(companyId, coupon);
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
