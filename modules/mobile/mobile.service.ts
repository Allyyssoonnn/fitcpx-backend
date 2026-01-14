import { HttpException, Injectable } from "@nestjs/common";
import { genTokenStudentRecoveryPassword } from "../../shared/utils/token";
import { genTokenStudentAuth } from "../../shared/utils/token.mobile";
import { CalendarRepository } from "../calendar/calendar.repository";
import { ChatRepository } from "../chat/chat.repository";
import { CompaniesService } from "../companies/companies.service";
import { ContractsService } from "../contracts/contracts.service";
import { EventsService } from "../events/events.service";
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
      private readonly contractsService: ContractsService,
      private readonly eventsService: EventsService,
      private readonly chatRepository: ChatRepository,
      private readonly calendarRepository: CalendarRepository
   ) {}

   async recoveryPassword(login: string) {
      let student = (await this.studentsService.getByEmail(login)) as any;
      if (!student) student = (await this.studentsService.getByCPF(login)) as any;

      if (!student) throw new HttpException("Usuário não encontrado!", 401);

      if (student.email_aluno) {
         const token = genTokenStudentRecoveryPassword(student.cod_aluno);
         const url = `https://app.fitcpx.com/recoveryPassword?student=true&token=${token}`;
         return this.eventsService.recoveryPasswordStudent(student.nome_aluno, student.email_aluno, url);
      }
   }

   async verifyAccount(login: string) {
      let student = (await this.studentsService.getByEmail(login.toLowerCase())) as any;
      if (!student) student = (await this.studentsService.getByCPF(login)) as any;

      if (!student) throw new HttpException("Usuário não encontrado!", 401);

      if (student?.nome_aluno) {
         return { name: student.nome_aluno, firstAccess: !student?.senha_aluno };
      } else return;
   }

   async login(login: string, password: string, deviceToken: string, platform: string, firstAccess: boolean) {
      let student = (await this.studentsService.getByEmail(login.toLowerCase())) as any;
      if (!student) student = (await this.studentsService.getByCPF(login)) as any;

      if (!student) throw new HttpException("Usuário não encontrado!", 401);

      if (firstAccess) {
         if (password.length < 5) throw new HttpException("Senha muito curta", 401);
         student.senha_aluno = password;
         student.save();
      } else {
         if (student.senha_aluno != password) throw new HttpException("Senha incorreta!", 401);
      }

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

   async getWorkoutHistory(companyId: string, studentId: string) {
      return this.workoutsService.getWorkoutHistory(companyId, studentId);
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

   async registerStudentMessage(studentId: string, companyId: string, message: string) {
      return this.chatRepository.create(message, companyId, studentId, "student");
   }

   async getMessages(studentId: string) {
      await this.chatRepository.markReadStudent(studentId);
      return this.chatRepository.findAll(studentId);
   }

   async getUnreadMessages(studentId: string) {
      return this.chatRepository.countUnreadMessages(studentId);
   }

   async findEvents(studentId: string) {
      return this.calendarRepository.findEvents(studentId);
   }

   async scheduleEvent(studentId: string, eventId: string) {
      //Verify if already schedule
      const event = (await this.calendarRepository.findById(eventId)) as any;
      if (event.cod_aluno) throw new HttpException("Evento já agendado por outro aluno", 403);

      return this.calendarRepository.scheduleEvent(studentId, eventId);
   }

   async sendFitnessAssessment(
      companyId: string,
      studentId: string,
      neck: Number,
      waist: Number,
      hip: Number,
      weight: Number,
      height: Number
   ) {
      return this.physicalAssessmentsService.createOrUpdate({
         cod_empresa: companyId,
         cod_aluno: studentId,
         pescoco: neck,
         cintura: waist,
         quadril: hip,
         cod_protocolo: 6,
         data_avaliacao: new Date(),
         peso: weight,
         altura: String(height).replace(/[,.]/g, "").padEnd(3, "0"),
      });
   }
}
