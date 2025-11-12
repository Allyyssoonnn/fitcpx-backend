import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { UserId } from "../../shared/decorators/userId.decorator";
import { WorkoutsService } from "./workouts.service";

@Controller("workouts")
export class WorkoutsController {
   constructor(private readonly workoutsService: WorkoutsService) {}

   @Post()
   async create(@UserId() userId: string, @CompanyId() companyId: string, @Body() body: any) {
      const { treino, sessoes } = body;
      return this.workoutsService.createOrUpdate(userId, companyId, treino, sessoes);
   }

   @Post("generateWorkout")
   async generateWorkout(@Body() body: any) {
      return this.workoutsService.generateWorkout(body);
   }

   @Get()
   async getAll(
      @CompanyId() companyId: string,
      @Query("deleted") deleted: string,
      @Query("studentId") studentId: string
   ) {
      return this.workoutsService.getAllWorkouts(companyId, deleted == "true", studentId);
   }

   @Delete(":id")
   async delete(@Param("id") id: string) {
      return this.workoutsService.delete(id);
   }

   @Get("getJoints")
   async getJoints(@Query("lang") lang: string) {
      return this.workoutsService.getJoints(lang);
   }

   @Get("getEquipaments")
   async getEquipaments(@Query("lang") lang: string) {
      return this.workoutsService.getEquipaments(lang);
   }

   @Get("getMuscleGroups")
   async getMuscleGroups(@Query("lang") lang: string) {
      return this.workoutsService.getMuscleGroups(lang);
   }

   @Get("getSugestions")
   async getSugestions(@Query("lang") lang: string) {
      return this.workoutsService.getSugestions(lang);
   }

   @Get("getExerciseTypes")
   async getExerciseTypes(@Query("lang") lang: string) {
      return this.workoutsService.getExerciseTypes(lang);
   }

   @Get("getExerciseResistences")
   async getExerciseResistences(@Query("lang") lang: string) {
      return this.workoutsService.getExerciseResistences(lang);
   }

   @Get("getMovementPatterns")
   async getMovementPatterns(@Query("lang") lang: string) {
      return this.workoutsService.getMovementPatterns(lang);
   }

   @Get(":id")
   async getOne(@Param("id") id: string) {
      return this.workoutsService.getWorkout(id);
   }
}
