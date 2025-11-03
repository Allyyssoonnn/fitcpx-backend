import { HttpException, Injectable } from "@nestjs/common";
import { validateToken } from "../../shared/utils/token";
import { CompaniesService } from "../companies/companies.service";
import { EventsService } from "../events/events.service";
import { StorageService } from "../storage/storage.service";
import { StudentsRepository } from "./students.repository";
const dev = process.env.NODE_ENV !== "production";

@Injectable()
export class StudentsService {
   constructor(
      private readonly studentsRepository: StudentsRepository,
      private readonly storageService: StorageService,
      private readonly eventsService: EventsService,
      private readonly comapniesService: CompaniesService
   ) {}

   async getAll(companyId: string, onlyDeleted: boolean) {
      return await this.studentsRepository.findAll(companyId, onlyDeleted);
   }

   async getById(id: string, companyId?: string) {
      return await this.studentsRepository.findById(id, companyId);
   }

   async getByEmail(cpf: string) {
      return await this.studentsRepository.findByEmail(cpf);
   }

   async getByCPF(cpf: string) {
      return await this.studentsRepository.findByCPF(cpf);
   }

   createOrUpdate = async (data: any, companyId: string) => {
      if (!data.cod_aluno) {
         //Verify student exist
         if (
            (data?.email_aluno && (await this.studentsRepository.findByEmail(data.email_aluno))) ||
            (data?.cpf_aluno && (await this.studentsRepository.findByCPF(data.cpf_aluno)))
         ) {
            throw new HttpException("Já existe um aluno com esse E-mail ou CPF", 403);
         }
      }
      const response = await this.studentsRepository.createOrUpdate(data);
      if (!data.cod_aluno && response.cod_aluno) {
         const company = (await this.comapniesService.getById(companyId)) as any;
         if (!company) throw new HttpException("Empresa não encontrada.", 404);
         return this.eventsService.welcomeStudent(response.nome_aluno, response.email_aluno, company.nome_empresa);
      } else return response;
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

   async findRefreshToken(refreshToken: string) {
      return this.studentsRepository.findRefreshToken(refreshToken);
   }

   async deleteRefreshToken(refreshToken: string) {
      return this.studentsRepository.deleteRefreshToken(refreshToken);
   }

   async saveDeviceTokenId(studentId: string, token: string, platform: string) {
      return this.studentsRepository.saveDeviceTokenId(studentId, token, platform);
   }

   async updatePassword(token: string, password: string) {
      try {
         const decoded = validateToken(token);
         if (!decoded.valid) {
            throw new HttpException("Token inválido", 401);
         }
         const studentId = decoded.decoded.cod_aluno;
         return await this.studentsRepository.updatePassword(password, studentId);
      } catch (error) {
         throw new HttpException("Token inválido", 401);
      }
   }
}
