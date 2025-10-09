import { Injectable } from "@nestjs/common";
import { ExercisesRepository } from "./exercises.repository";

@Injectable()
export class ExercisesService {
   constructor(private readonly exercisesRepository: ExercisesRepository) {}

   async getAll(companyId: string | null, onlyDeleted: boolean, lang: string) {
      return await this.exercisesRepository.findAll(companyId, onlyDeleted, lang);
   }

   async delete(id: string) {
      return await this.exercisesRepository.deleteById(id);
   }

   async createOrUpdate(data: any, companyId: string) {
      return await this.exercisesRepository.createOrUpdate(data, companyId);
   }
}
