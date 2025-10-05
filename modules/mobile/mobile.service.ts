import { HttpException, Injectable } from "@nestjs/common";
import { genTokenStudentAuth } from "../../shared/utils/token.mobile";
import { CompaniesService } from "../companies/companies.service";
import { ContractsService } from "../contracts/contracts.service";
import { ExercisesService } from "../exercises/exercises.service";
import { PhysicalAssessmentsService } from "../physicalAssessments/physicalAssessments.service";
import { StudentsService } from "../students/students.service";
import { WorkoutsService } from "../workouts/workouts.service";

@Injectable()
export class MobileService {
   constructor(
      private readonly studentsService: StudentsService,
      private readonly companiesService: CompaniesService,
      private readonly exercisesService: ExercisesService,
      private readonly physicalAssessmentsService: PhysicalAssessmentsService,
      private readonly workoutsService: WorkoutsService,
      private readonly contractsService: ContractsService
   ) {}

   async login(login: string, password: string, deviceToken: string, platform: string) {
      let student = (await this.studentsService.getByEmail(login)) as any;
      if (!student) student = (await this.studentsService.getByCPF(login)) as any;

      if (!student) throw new HttpException("Usuário não encontrado!", 401);
      if (student.senha_aluno != password) throw new HttpException("Senha incorreta!", 401);

      let company = (await this.companiesService.getById(student.cod_empresa)) as any;

      const { token, refreshToken } = await genTokenStudentAuth(student.cod_aluno, company.cod_empresa);

      if (deviceToken && platform) this.studentsService.saveDeviceTokenId(student.cod_aluno, deviceToken, platform);

      return { student, company, token, refreshToken };
   }

   async refreshToken(refreshTokenReq: string, deviceToken: string, platform: string) {
      if (!refreshTokenReq) throw new HttpException("Token não informado!", 401);
      const refreshTokenDB = (await this.studentsService.findRefreshToken(refreshTokenReq)) as any;
      if (!refreshTokenDB) throw new HttpException("Token inválido", 401);

      if (refreshTokenDB.expiresAt < new Date()) {
         await this.studentsService.deleteRefreshToken(refreshTokenReq);
         throw new HttpException("Token expirado", 401);
      }

      const student = (await this.studentsService.getById(refreshTokenDB?.cod_aluno)) as any;
      const company = (await this.companiesService.getById(student?.cod_empresa)) as any;

      const { token, refreshToken } = await genTokenStudentAuth(student.cod_aluno, company.cod_empresa);

      if (deviceToken && platform) this.studentsService.saveDeviceTokenId(student.cod_aluno, deviceToken, platform);

      return { student, company, token, refreshToken };
   }

   async getExercises(lang: string) {
      return this.exercisesService.getAll(null, false, lang);
   }

   async getPhysicalAssessments(companyId: string, studentId: string) {
      return this.physicalAssessmentsService.getAll(companyId, false, studentId);
   }

   async getPhysicalAssessmentById(studentId: string, physicalAssessmentId: string) {
      return this.physicalAssessmentsService.getById(studentId, physicalAssessmentId);
   }

   async getWorkouts(companyId: string, studentId: string) {
      return this.workoutsService.getAllWorkouts(companyId, false, studentId);
   }

   async getContracts(companyId: string, studentId: string) {
      return this.contractsService.getContracts(companyId, studentId);
   }

   async finishTreino(session: any, time: string, studentId: string) {
      return this.workoutsService.registerWorkoutStudent(session, time, studentId);
   }
}
