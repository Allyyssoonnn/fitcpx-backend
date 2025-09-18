import { HttpException, Injectable } from "@nestjs/common";
import { StorageService } from "../storage/storage.service";
import { StudentsRepository } from "./students.repository";
const dev = process.env.NODE_ENV !== "production";

@Injectable()
export class StudentsService {
   constructor(
      private readonly studentsRepository: StudentsRepository,
      private readonly storageService: StorageService
   ) {}

   async getAll(companyId: string, onlyDeleted: boolean) {
      return await this.studentsRepository.findAll(companyId, onlyDeleted);
   }

   async getById(id: string, companyId: string) {
      return await this.studentsRepository.findById(id, companyId);
   }

   createOrUpdate = async (data: any) => {
      return await this.studentsRepository.createOrUpdate(data);
   };

   async delete(id: string) {
      return await this.studentsRepository.deleteById(id);
   }

   async updateImageUser(studentId: string, fileBuffer: Express.Multer.File) {
      if (!fileBuffer) throw new HttpException("Arquivo não enviado.", 400);

      const key = `${dev ? "developer/" : ""}aluno/perfil/${Date.now()}_${fileBuffer.originalname}`;
      const url = await this.storageService.uploadFile(fileBuffer, key);

      this.studentsRepository.updateImageStudent(studentId, url);
      return url;
   }
}
