import { Injectable } from "@nestjs/common";
import { ServicesService } from "../services/services.service";
import { PlansRepository } from "./plans.repository";

@Injectable()
export class PlansService {
   constructor(private readonly plansRepository: PlansRepository, private readonly servicesService: ServicesService) {}

   async getAll(companyId: string, onlyDeleted: boolean) {
      return await this.plansRepository.findAll(companyId, onlyDeleted);
   }

   async createPlan(data: any, modalidades: any) {
      return this.plansRepository.createOrUpdate(data, modalidades);
   }

   async delete(id: string) {
      return await this.plansRepository.deleteById(id);
   }
}
