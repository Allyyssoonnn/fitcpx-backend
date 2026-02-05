import { S3Client } from "@aws-sdk/client-s3";
import {
   Body,
   Controller,
   Delete,
   Get,
   Headers,
   Param,
   Post,
   Query,
   UploadedFile,
   UploadedFiles,
   UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { randomUUID } from "crypto";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { StudentsService } from "./students.service";
const dev = process.env.NODE_ENV !== "production";

@Controller("students")
export class StudentsController {
   constructor(private readonly studentsService: StudentsService) {}

   @Get("/attachments")
   async getAllAttachments(@CompanyId() cod_empresa: string, @Query("studentId") studentId: string) {
      return await this.studentsService.getAllAttachments(studentId);
   }

   @Delete("/attachments")
   async deleteAttachments(@CompanyId() cod_empresa: string, @Query("id") id: string) {
      return await this.studentsService.deleteAttachment(id);
   }

   @Post("/attachments")
   @UseInterceptors(
      FilesInterceptor("files", 5, {
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
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            //Para debugs futuro no console aws
            metadata: function (req, file, cb) {
               cb(null, {
                  fieldName: file.fieldname,
                  originalName: file.originalname, // Salva o nome original "oculto" no objeto S3
               });
            },
            key: function (req: any, file: any, cb: any) {
               const devPrefix = dev ? "developer/" : "";

               const uuid = randomUUID();
               const fileExt = path.extname(file.originalname);
               const newFileName = `${uuid}${fileExt}`;

               const s3Key = `${devPrefix}aluno/attachments/${newFileName}`;

               cb(null, s3Key);
            },
         }),
         limits: {
            fileSize: 50 * 1024 * 1024,
         },
      }),
   )
   async sendAttachments(
      @Headers() header: any,
      @UploadedFiles() files: Express.MulterS3.File[],
      @Query("studentId") studentId: string,
   ) {
      const attachmentsData = files.map((f) => ({
         // key: f.key,
         // bucket: 'media.fitcpx.com',
         studentId,
         url: f.location,
         type: path.extname(f.originalname),
         name: f.originalname,
      }));

      return this.studentsService.sendAttachments(attachmentsData);
   }

   @Get()
   async getAll(@CompanyId() cod_empresa: string, @Query("deleted") deleted: string) {
      return await this.studentsService.getAll(cod_empresa, deleted == "true");
   }

   @Get(":id")
   async getById(@Param("id") id: string, @CompanyId() cod_empresa: string) {
      return await this.studentsService.getById(id, cod_empresa);
   }

   @Post()
   async createOrUpdate(@Body() body: any, @CompanyId() companyId: string) {
      return this.studentsService.createOrUpdate(body, companyId);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.studentsService.delete(id);
   }

   @Post("updateImageStudent")
   @UseInterceptors(
      FileInterceptor("image", {
         storage: multer.memoryStorage(),
      }),
   )
   async updateImageUser(
      @Headers() header: any,
      @UploadedFile() fileBuffer: Express.Multer.File,
      @Query("studentId") studentId: string,
   ) {
      return this.studentsService.updateImageUser(studentId, fileBuffer);
   }

   @Post("updatePassword")
   async updatePassword(@Body() body: { token: string; password: string }) {
      const { token, password } = body;
      return this.studentsService.updatePassword(token, password);
   }

   @Post("verifyExists")
   async verifyExists(@Body() body: any) {
      const { email, cpf } = body;
      return this.studentsService.verifyExists(email, cpf);
   }
}
