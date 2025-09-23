import { Injectable } from "@nestjs/common";
import { ContractsTemplatesRepository } from "./contractsTemplates.repository";

@Injectable()
export class ContractsTemplatesService {
   constructor(private readonly contractsTemplatesRepository: ContractsTemplatesRepository) {}

   async getAll(companyId: string, onlyDeleted: boolean) {
      return await this.contractsTemplatesRepository.findAll(companyId, onlyDeleted);
   }

   async delete(id: string) {
      return await this.contractsTemplatesRepository.deleteById(id);
   }

   async createOrUpdate(data: any) {
      return await this.contractsTemplatesRepository.createOrUpdate(data);
   }
}
