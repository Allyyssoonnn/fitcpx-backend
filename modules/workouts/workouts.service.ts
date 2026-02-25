import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { WorkoutsRepository } from "./workouts.repository";
import { generateWorkoutTemplate } from "./workouts.utils";

@Injectable()
export class WorkoutsService {
   constructor(
      private readonly workoutsRepository: WorkoutsRepository,
      private readonly eventEmitter: EventEmitter2,
   ) {}

   async getWorkoutHistory(companyId: string, studentId?: string) {
      return this.workoutsRepository.getWorkoutHistory(companyId, studentId);
   }

   async getWorkoutHistoryReport(companyId: string, workoutId: string) {
      return this.workoutsRepository.getWorkoutHistoryReport(companyId, workoutId);
   }

   async getAllWorkouts(companyId: string, deleted: boolean, studentId?: string, onlyActives: boolean = true) {
      return this.workoutsRepository.findAll(companyId, deleted, studentId, onlyActives);
   }

   async getWorkout(workoutId: string) {
      return this.workoutsRepository.findOne(workoutId);
   }

   async generateWorkout(body: any) {
      return generateWorkoutTemplate(body);
   }

   async delete(id: string) {
      return this.workoutsRepository.deleteById(id);
   }

   async createOrUpdate(userId: string, companyId: string, workout: any, sessions: any[]) {
      const response = await this.workoutsRepository.createOrUpdate(userId, companyId, workout, sessions);
      if (workout?.cod_aluno && !workout?.cod_treino && response?.cod_aluno) {
         this.eventEmitter.emit("new.workout", workout.cod_aluno);
      }
      return response;
   }

   async getJoints(lang: string) {
      return this.workoutsRepository.getJoints(lang);
   }

   async getEquipaments(lang: string) {
      return this.workoutsRepository.getEquipaments(lang);
   }

   async getMuscleGroups(lang: string) {
      return this.workoutsRepository.getMuscleGroups(lang);
   }

   async getSugestions(lang: string) {
      return this.workoutsRepository.getSugestions(lang);
   }

   async getExerciseTypes(lang: string) {
      return this.workoutsRepository.getExerciseTypes(lang);
   }

   async getExerciseResistences(lang: string) {
      return this.workoutsRepository.getExerciseResistences(lang);
   }

   async getMovementPatterns(lang: string) {
      return this.workoutsRepository.getMovementPatterns(lang);
   }

   async registerWorkoutStudent(session: any, time: string, studentId: string) {
      return this.workoutsRepository.registerWorkoutStudent(session, time, studentId);
   }
}
