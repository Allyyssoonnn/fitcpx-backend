import { Body, Controller, Get, Post } from "@nestjs/common";
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
}
