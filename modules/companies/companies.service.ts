import { Injectable } from "@nestjs/common";
import { CompaniesRepository } from "./companies.repository";

@Injectable()
export class CompaniesService {
   constructor(private readonly companiesRepository: CompaniesRepository) {}

   async getAll() {
      return await this.companiesRepository.findAll();
   }

   async getById(id: string) {
      return await this.companiesRepository.findById(id);
   }

   async getByEmail(email: string) {
      return await this.companiesRepository.findByEmail(email);
   }

   async createOrUpdate(data: any) {
      return await this.companiesRepository.createOrUpdate(data);
   }
}
