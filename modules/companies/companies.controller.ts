import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
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
      })
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
   async cancelLicense(@CompanyId() companyId: string, @Body("licenseId") licenseId: string) {
      return this.companiesService.cancelCompanyLicense(companyId, licenseId);
   }

   @Get("getDashboardInfo")
   async getDashboardInfo(@CompanyId() companyId: string) {
      return this.companiesService.getDashboardInfo(companyId);
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
}
