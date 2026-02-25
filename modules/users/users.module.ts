import { Module } from "@nestjs/common";
import { CompaniesModule } from "../companies/companies.module";
import { EventsModule } from "../events/events.module";
import { StorageModule } from "../storage/storage.module";
import { StudentsModule } from "../students/students.module";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
   imports: [StorageModule, StudentsModule, CompaniesModule, EventsModule],
   controllers: [UsersController],
   providers: [UsersRepository, UsersService],
   exports: [UsersService, UsersRepository],
})
export class UsersModule {}
