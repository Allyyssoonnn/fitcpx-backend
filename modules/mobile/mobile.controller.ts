import { S3Client } from "@aws-sdk/client-s3";
import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import multerS3 from "multer-s3";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { StudentId } from "../../shared/decorators/studentId.decorator";
import { MobileService } from "./mobile.service";
const dev = process.env.NODE_ENV !== "production";

@Controller("mobile")
export class MobileController {
   constructor(private readonly mobileService: MobileService) {}

   @Post("recoveryPassword")
   async recoveryPassword(@Body() body: any) {
      const { login } = body;
      return this.mobileService.recoveryPassword(login);
   }

   @Post("verifyAccount")
   async verifyAccount(@Body() body: any) {
      const { login } = body;
      return this.mobileService.verifyAccount(login);
   }

   @Post("login")
   async login(@Body() body: any) {
      const { login, password, deviceToken, platform, firstAccess } = body;
      return this.mobileService.login(login, password, deviceToken, platform, firstAccess);
   }

   @Get("getExercises")
   async getExercises(@Query("lang") lang: string) {
      return this.mobileService.getExercises(lang);
   }

   @Get("getPhysicalAssessments")
   async getPhysicalAssessments(@CompanyId() companyId: string, @StudentId() studentId: string) {
      return this.mobileService.getPhysicalAssessments(companyId, studentId);
   }

   @Get("getPhysicalAssessment")
   async getPhysicalAssessment(
      @StudentId() studentId: string,
      @Query("physicalAssessmentId") physicalAssessmentId: string,
   ) {
      return this.mobileService.getPhysicalAssessmentById(studentId, physicalAssessmentId);
   }

   @Get("getWorkoutHistory")
   async getWorkoutHistory(@CompanyId() companyId: string, @StudentId() studentId: string) {
      return this.mobileService.getWorkoutHistory(companyId, studentId);
   }

   @Get("getWorkouts")
   async getWorkouts(@CompanyId() companyId: string, @StudentId() studentId: string) {
      return this.mobileService.getWorkouts(companyId, studentId);
   }

   @Get("getContracts")
   async getContracts(@CompanyId() companyId: string, @StudentId() studentId: string) {
      return this.mobileService.getContracts(companyId, studentId);
   }

   @Post("refreshToken")
   async refreshToken(@Body() body: any) {
      const { refreshToken, deviceToken, platform } = body;
      return this.mobileService.refreshToken(refreshToken, deviceToken, platform);
   }

   @Post("finishTreino")
   async finishTreino(@Body() body: any) {
      const { sessao, tempo, cod_aluno } = body;
      return this.mobileService.finishTreino(sessao, tempo, cod_aluno);
   }

   @Post("sendStudentMessage")
   async sendStudentMessage(
      @CompanyId() companyId: string,
      @StudentId() studentId: string,
      @Body("message") message: string,
   ) {
      return this.mobileService.registerStudentMessage(studentId, companyId, message);
   }

   @Get("getMessages")
   async getMessages(@StudentId() studentId: string) {
      return this.mobileService.getMessages(studentId);
   }

   @Get("getUnreadMessages")
   async getUnreadMessages(@StudentId() studentId: string) {
      return this.mobileService.getUnreadMessages(studentId);
   }

   @Get("findEvents")
   async findEvents(@StudentId() studentId: string, @CompanyId() companyId: string) {
      return this.mobileService.findEvents(studentId, companyId);
   }

   @Get("scheduleEvent")
   async scheduleEvent(@StudentId() studentId: string, @Query("eventId") eventId: string) {
      return this.mobileService.scheduleEvent(studentId, eventId);
   }

   @Post("sendFitnessAssessment")
   @UseInterceptors(
      FilesInterceptor("images", 30, {
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
            key: function (req: any, file: any, cb: any) {
               const devPrefix = dev ? "developer/" : "";
               const baseKey = `aluno/avaliacao/${Date.now()}_${file.originalname}`;
               const s3Key = `${devPrefix}/${baseKey}`;
               cb(null, s3Key);
            },
         }),
         limits: {
            fileSize: 50 * 1024 * 1024,
         },
      }),
   )
   async sendFitnessAssessment(
      @CompanyId() companyId: string,
      @StudentId() studentId: string,
      @Body("neck") neck: Number,
      @Body("waist") waist: Number,
      @Body("hip") hip: Number,
      @Body("weight") weight: Number,
      @Body("height") height: Number,
      @UploadedFiles() files: Express.MulterS3.File[],
   ) {
      return this.mobileService.sendFitnessAssessment(companyId, studentId, neck, waist, hip, weight, height, files);
   }
}
