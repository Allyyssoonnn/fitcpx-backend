import { Module } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { UsersRepository } from "../users/users.repository";
import { GoogleAPI } from "./google.api";
import { GoogleController } from "./google.controller";
import { GoogleService } from "./google.service";

@Module({
   controllers: [GoogleController],
   providers: [GoogleService, GoogleAPI, UsersRepository, CompaniesRepository],
})
export class GoogleModule {}
