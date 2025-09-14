import { HttpException, Injectable } from "@nestjs/common";
import { StorageService } from "../storage/storage.service";
import { PhysicalAssessmentsRepository } from "./physicalAssessments.repository";
const dev = (process.env.NODE_ENV || "development") === "development";

@Injectable()
export class PhysicalAssessmentsService {
   constructor(
      private readonly physicalAssessmentsRepository: PhysicalAssessmentsRepository,
      private readonly storageService: StorageService
   ) {}

   async getAll(companyId: string, deleted: boolean, studentId?: string) {
      return this.physicalAssessmentsRepository.findAll(companyId, deleted, studentId);
   }

   createOrUpdate = async (data: any) => {
      return await this.physicalAssessmentsRepository.createOrUpdate(data);
   };

   delete = async (id: string) => {
      return await this.physicalAssessmentsRepository.deleteById(id);
   };

   async updateImagePhysicalAssessment(
      physicalAssessmentId: string,
      filesBuffer: Express.Multer.File[],
      deletedImages?: string[]
   ) {
      if (!filesBuffer.length) throw new HttpException("Arquivo não enviado.", 400);

      if (Array.isArray(deletedImages)) {
         for (const imageData of deletedImages) {
            const id = imageData.split("/")[imageData.split("/").length - 1];
            this.physicalAssessmentsRepository.deleteImage(imageData);
         }
      }

      const images = [];

      for (const fileBuffer of filesBuffer) {
         const key = `${dev ? "developer/" : ""}aluno/avaliacao/${Date.now()}_${fileBuffer.originalname}`;
         const url = await this.storageService.uploadFile(fileBuffer, key);
         if (url) {
            images.push({
               url_imagem: url,
               descricao_imagem: fileBuffer.originalname.split("[")[1].split("]")[0],
               tamanho_imagem: fileBuffer.originalname.split("(")[1].split(")")[0],
               cod_avaliacao: physicalAssessmentId,
            });
         }
      }

      return this.physicalAssessmentsRepository.addImages(images);
   }
}
