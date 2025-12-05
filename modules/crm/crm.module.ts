import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { CRMAPI } from "./crm.api";
import { CRMController } from "./crm.controller";
import { CRMRepository } from "./crm.repository";
import { CRMService } from "./crm.service";

@Module({
   controllers: [CRMController],
   providers: [CRMService, CRMAPI, CRMRepository, CompaniesRepository],
})
export class CRMModule {}
