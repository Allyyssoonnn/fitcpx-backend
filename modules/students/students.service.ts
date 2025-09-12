import { Injectable } from "@nestjs/common";
import { StudentsRepository } from "./students.repository";

@Injectable()
export class StudentsService {
   constructor(private readonly studentsRepository: StudentsRepository) {}

   async getAll(companyId: string, onlyDeleted: boolean) {
      return await this.studentsRepository.findAll(companyId, onlyDeleted);
   }

   async getById(id: string, companyId: string) {
      return await this.studentsRepository.findById(id, companyId);
   }
}
