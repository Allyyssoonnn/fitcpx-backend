import { Injectable } from "@nestjs/common";
import { WorkoutsRepository } from "./workouts.repository";
import { generateWorkoutTemplate } from "./workouts.utils";

@Injectable()
export class WorkoutsService {
   constructor(private readonly workoutsRepository: WorkoutsRepository) {}

   async getAllWorkouts(companyId: string, deleted: boolean, studentId?: string) {
      return this.workoutsRepository.findAll(companyId, deleted, studentId);
   }

   async generateWorkout(body: any) {
      return generateWorkoutTemplate(body);
   }

   async delete(id: string) {
      return this.workoutsRepository.deleteById(id);
   }

   async createOrUpdate(companyId: string, workout: any, sessions: any[]) {
      return this.workoutsRepository.createOrUpdate(companyId, workout, sessions);
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
