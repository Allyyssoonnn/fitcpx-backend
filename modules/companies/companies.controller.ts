import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { UserId } from "../../shared/decorators/userId.decorator";
import { genTokenUserAuth } from "../../shared/utils/token";
import { CompaniesService } from "./companies.service";

@Controller("companies")
export class CompaniesController {
   constructor(private readonly companiesService: CompaniesService) {}

   @Get()
   async getAll() {
      return await this.companiesService.getAll();
   }

   @Post()
   async createOrUpdate(@Body() body: any) {
      return this.companiesService.createOrUpdate(body);
   }

   @Post("updateImageCompany")
   @UseInterceptors(
      FileInterceptor("image", {
         storage: multer.memoryStorage(),
      }),
   )
   async updateImageCompany(@CompanyId() companyId: string, @UploadedFile() fileBuffer: Express.Multer.File) {
      return this.companiesService.updateImageCompany(companyId, fileBuffer);
   }

   @Get("getAllCompanyLicenses")
   async getAllCompanyLicenses(@CompanyId() companyId: string) {
      return await this.companiesService.getAllCompaniesLicenses(companyId);
   }

   @Get("getCompanyLicense")
   async getAllCompanyLicense(@CompanyId() companyId: string) {
      return await this.companiesService.getCompanyLicense(companyId);
   }

   @Post("cancelCompanyLicense")
   async cancelLicense(@CompanyId() companyId: string, @Body("licenseId") licenseId: string, @UserId() userId: string) {
      await this.companiesService.cancelAllCompanyLicenses(companyId);
      const { token, refreshToken, license } = await genTokenUserAuth(userId, companyId);
      return { token, refreshToken, license };
   }

   @Get("getDashboardInfo")
   async getDashboardInfo(@CompanyId() companyId: string) {
      return this.companiesService.getDashboardInfo(companyId);
   }

   @Get("getOlderPhysicalAssessments")
   async getOlderPhysicalAssessments(@CompanyId() companyId: string) {
      return this.companiesService.getOlderPhysicalAssessments(companyId);
   }

   @Get("getLastActivities")
   async getLastActivities(@CompanyId() companyId: string) {
      return this.companiesService.getLastActivities(companyId);
   }

   @Get("getToursInfo")
   async getToursInfo(@CompanyId() companyId: string) {
      return this.companiesService.getToursInfo(companyId);
   }

   @Post("sendFeedback")
   async sendFeedback(@CompanyId() companyId: string, @Body() body: any) {
      const { type, message } = body;
      return this.companiesService.sendFeedback(companyId, type, message);
   }

   @Get("getNotifications")
   async getNotifications(@CompanyId() companyId: string) {
      return this.companiesService.getNotifications(companyId);
   }

   @Post("saveNotificationsConfig")
   async saveNotificationsConfig(@CompanyId() companyId: string, @Body("notifications") notifications: string) {
      return this.companiesService.saveNotificationsConfig(companyId, notifications);
   }

   @Get("getNotificationsConfig")
   async getNotificationsConfig(@CompanyId() companyId: string) {
      return this.companiesService.getNotificationsConfig(companyId);
   }

   @Get("getCompanyAndPlans")
   async getCompanyAndPlans(@Query("companyId") companyId: string) {
      return this.companiesService.getCompanyAndPlans(companyId);
   }

   @Get("getCheckoutLink")
   async getCheckoutLink(
      @CompanyId() companyId: string,
      @UserId() userId: string,
      @Query("planId") planId: string,
      @Query("studentId") studentId: string,
   ) {
      return this.companiesService.getCheckoutLink(companyId, userId, planId, studentId);
   }

   @Get("getCheckoutInfo")
   async getCheckoutInfo(@Query("token") token: string) {
      return this.companiesService.getCheckoutInfo(token);
   }
}
