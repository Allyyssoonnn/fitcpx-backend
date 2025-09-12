import { Injectable } from "@nestjs/common";
import { CompaniesRepository } from "./companies.repository";

@Injectable()
export class CompaniesService {
   constructor(private readonly companiesRepository: CompaniesRepository) {}

   async getAll() {
      return await this.companiesRepository.findAll();
   }
}
