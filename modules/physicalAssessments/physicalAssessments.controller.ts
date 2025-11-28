import { S3Client } from "@aws-sdk/client-s3";
import {
   Body,
   Controller,
   Delete,
   Get,
   Headers,
   HttpException,
   Param,
   Post,
   Query,
   Response,
   UploadedFiles,
   UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import multerS3 from "multer-s3";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { StorageAPI } from "../storage/storage.api";
import { PhysicalAssessmentsService } from "./physicalAssessments.service";
const dev = process.env.NODE_ENV !== "production";

@Controller("physicalAssessments")
export class PhysicalAssessmentsController {
   constructor(
      private readonly physicalAssessmentsService: PhysicalAssessmentsService,
      private readonly storageApi: StorageAPI
   ) {}

   @Get("fitnessassessmentpdf")
   async getTemplatePrint(@Response() res: any) {
      return res.sendFile(__dirname + "/templates/fitnessassessmentpdf.html");
   }

   @Get()
   async getAll(
      @CompanyId() companyId: string,
      @Query("studentId") studentId?: string,
      @Query("deleted") deleted?: string
   ) {
      return this.physicalAssessmentsService.getAll(companyId, deleted == "true", studentId);
   }

   @Post()
   async createOrUpdate(@Body() body: any) {
      return this.physicalAssessmentsService.createOrUpdate(body);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.physicalAssessmentsService.delete(id);
   }

   @Post("updateImagePhysicalAssessment")
   @UseInterceptors(
      FilesInterceptor("image", 30, {
         // storage: multer.memoryStorage(),
         //REMOVIDO MEMORYSTORAGE POIS IA CONSUMIR TODA A RAM DO SERVIDOR SALVANDO TUDO EM MEMORIA ANTES DE ENVIAR
         storage: multerS3({
            s3: new S3Client({
               region: "sa-east-1",
               credentials: {
                  accessKeyId: "[REDACTED_CREDENTIAL]",
                  secretAccessKey: "[REDACTED_CREDENTIAL]",
               },
               requestHandler: {
                  metadata: { timeout: 300000 },
               },
            }),
            bucket: "media.fitcpx.com",
            acl: "public-read", // ou private
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req: any, file: any, cb: any) {
               const devPrefix = dev ? "developer/" : ""; // <--- Novo prefixo

               // A lógica de nomes do seu service original era: "aluno/avaliacao/"
               const baseKey = `aluno/avaliacao/${Date.now()}_${file.originalname}`;

               // Construção do novo KEY no S3
               const s3Key = `${devPrefix}${req.query.physicalId}/${baseKey}`;

               cb(null, s3Key);
            },
         }),
      })
   )
   async updateImageUser(
      @Headers() headers: any,
      @UploadedFiles() files: Express.Multer.File[],
      @Query("physicalId") physicalId: string
   ) {
      const { deletedimages } = headers;
      if (!physicalId) {
         throw new HttpException("Erro - ID da avaliação não recebido", 403);
      }
      return this.physicalAssessmentsService.updateImagePhysicalAssessment(physicalId, files, deletedimages);
   }
}
