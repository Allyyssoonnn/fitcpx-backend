import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { StudentId } from "../../shared/decorators/studentId.decorator";
import { MobileService } from "./mobile.service";

@Controller("mobile")
export class MobileController {
   constructor(private readonly mobileService: MobileService) {}

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
      @Query("physicalAssessmentId") physicalAssessmentId: string
   ) {
      return this.mobileService.getPhysicalAssessmentById(studentId, physicalAssessmentId);
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
}
