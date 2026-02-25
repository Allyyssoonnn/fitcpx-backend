import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { WorkoutsController } from "./workouts.controller";
import { WorkoutsRepository } from "./workouts.repository";
import { WorkoutsService } from "./workouts.service";

@Module({
   imports: [EventsModule],
   controllers: [WorkoutsController],
   providers: [WorkoutsService, WorkoutsRepository],
   exports: [WorkoutsService, WorkoutsRepository],
})
export class WorkoutsModule {}
