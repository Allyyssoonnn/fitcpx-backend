import { HttpException, Injectable } from "@nestjs/common";
import { StorageService } from "../storage/storage.service";
import { CompaniesRepository } from "./companies.repository";
const dev = process.env.NODE_ENV !== "development";

@Injectable()
export class CompaniesService {
   constructor(
      private readonly companiesRepository: CompaniesRepository,
      private readonly storageService: StorageService
   ) {}

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

   async updateImageCompany(companyId: string, fileBuffer: Express.Multer.File) {
      if (!fileBuffer) throw new HttpException("Arquivo não enviado.", 400);

      const key = `${dev ? "developer/" : ""}empresa/perfil/${Date.now()}_${fileBuffer.originalname}`;
      const url = await this.storageService.uploadFile(fileBuffer, key);

      this.companiesRepository.updateImageCompany(companyId, url);
      return url;
   }
}
