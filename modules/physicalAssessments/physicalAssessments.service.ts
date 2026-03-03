import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PhysicalAssessmentsRepository } from "./physicalAssessments.repository";

@Injectable()
export class PhysicalAssessmentsService {
   constructor(
      private readonly physicalAssessmentsRepository: PhysicalAssessmentsRepository,
      private readonly eventEmitter: EventEmitter2,
   ) {}

   async getAll(companyId: string, deleted: boolean, studentId?: string) {
      return this.physicalAssessmentsRepository.findAll(companyId, deleted, studentId);
   }

   async getById(studentId: string, physicalAssessmentId: string) {
      return this.physicalAssessmentsRepository.findById(studentId, physicalAssessmentId);
   }

   createOrUpdate = async (data: any) => {
      // *** ESTAVA REMOVENDO DADOS, NÃO APAGAVA NADA NA EDIÇÃO
      // const dataCleaned = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null && v !== "")) as any;
      const response = (await this.physicalAssessmentsRepository.createOrUpdate(data)) as any;
      if (!data?.cod_avaliacao && data?.cod_aluno && response?.cod_avaliacao) {
         this.eventEmitter.emit("new.physicalAssessment", data.cod_aluno);
      }
      return response;
   };

   delete = async (id: string) => {
      return await this.physicalAssessmentsRepository.deleteById(id);
   };

   async updateImagePhysicalAssessment(
      physicalAssessmentId: string,
      filesBuffer: Express.Multer.File[],
      deletedImages?: string,
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

      //Apenas salva pois o controller envia direto para o S3
      for (const file of filesBuffer as any[]) {
         const url = file.location;
         const imageUrl = `https://store.fitcpx.com/${file.key}`;

         if (imageUrl) {
            images.push({
               url_imagem: imageUrl,
               descricao_imagem: file.originalname.split("[")[1].split("]")[0],
               tamanho_imagem: file.originalname.split("(")[1].split(")")[0],
               cod_avaliacao: physicalAssessmentId,
            });
         }
      }

      return this.physicalAssessmentsRepository.addImages(images);
   }
}
