import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SkipThrottle } from "@nestjs/throttler";
import { LicensesService } from "../licenses/licenses.service";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
   constructor(private readonly adminService: AdminService, private readonly licensesService: LicensesService) {}

   @Get("resetTrial")
   async resetTrial(@Query("companyId") companyId: string) {
      return this.adminService.resetTrial(companyId);
   }

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

   @Post("sendNotify")
   @UseInterceptors(FileInterceptor("proof"))
   async sendNotify(
      @UploadedFile() fileBuffer: Express.Multer.File,
      @Query("companyId") companyId: string,
      @Body("clients") clients: any,
      @Body("startDate") startDate: string,
      @Body("endDate") endDate: string
   ) {
      if (!fileBuffer) throw new Error("Arquivo obrigatório");
      return this.adminService.sendPayoutNotify(companyId, fileBuffer.buffer, clients, startDate, endDate);
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
