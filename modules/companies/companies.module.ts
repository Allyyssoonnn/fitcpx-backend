import { Module } from "@nestjs/common";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { CompaniesController } from "./companies.controller";
import { CompaniesRepository } from "./companies.repository";
import { CompaniesService } from "./companies.service";

@Module({
   controllers: [CompaniesController],
   providers: [CompaniesRepository, CompaniesService, StorageService, StorageAPI],
})
export class CompaniesModule {}
