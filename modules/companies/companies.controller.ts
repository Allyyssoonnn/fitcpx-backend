import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { CompanyId } from "../../decorators/companyId.decorator";
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
}
