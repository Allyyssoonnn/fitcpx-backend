import { Injectable } from "@nestjs/common";
import { ServicesRepository } from "./services.repository";

@Injectable()
export class ServicesService {
   constructor(private readonly servicesRepository: ServicesRepository) {}

   async getAll(companyId: string, deleted: boolean) {
      return this.servicesRepository.findAll(companyId, deleted);
   }

   async getById(id: string) {
      return this.servicesRepository.findById(id);
   }

   createOrUpdate = async (data: any) => {
      return await this.servicesRepository.createOrUpdate(data);
   };

   delete = async (id: string) => {
      return await this.servicesRepository.deleteById(id);
   };
}
