import { Injectable } from "@nestjs/common";
import { EventsService } from "../events/events.service";
import { StorageService } from "../storage/storage.service";
import { PhysicalAssessmentsRepository } from "./physicalAssessments.repository";
const dev = process.env.NODE_ENV !== "production";

@Injectable()
export class PhysicalAssessmentsService {
   constructor(
      private readonly physicalAssessmentsRepository: PhysicalAssessmentsRepository,
      private readonly storageService: StorageService,
      private readonly eventsService: EventsService
   ) {}

   async getAll(companyId: string, deleted: boolean, studentId?: string) {
      return this.physicalAssessmentsRepository.findAll(companyId, deleted, studentId);
   }

   async getById(studentId: string, physicalAssessmentId: string) {
      return this.physicalAssessmentsRepository.findById(studentId, physicalAssessmentId);
   }

   createOrUpdate = async (data: any) => {
      const dataCleaned = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null && v !== "")) as any;
      const response = (await this.physicalAssessmentsRepository.createOrUpdate(dataCleaned)) as any;
      if (!dataCleaned?.cod_avaliacao && dataCleaned?.cod_aluno && response?.cod_avaliacao) {
         await this.eventsService.newPhysicalAssessment(dataCleaned.cod_aluno);
      }
      return response;
   };

   delete = async (id: string) => {
      return await this.physicalAssessmentsRepository.deleteById(id);
   };

   async updateImagePhysicalAssessment(
      physicalAssessmentId: string,
      filesBuffer: Express.Multer.File[],
      deletedImages?: string
   ) {
      if (deletedImages) {
         const array = JSON.parse(deletedImages);
         if (Array.isArray(array)) {
            for (const imageData of array) {
               const id = imageData.split("/")[imageData.split("/").length - 1];
               this.physicalAssessmentsRepository.deleteImage(imageData);
            }
         }
      }

      if (!filesBuffer.length) return;

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
