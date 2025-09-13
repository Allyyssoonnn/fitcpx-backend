import { Module } from "@nestjs/common";
import { StorageAPI } from "../storage/storage.api";
import { StorageService } from "../storage/storage.service";
import { StudentsController } from "./students.controller";
import { StudentsRepository } from "./students.repository";
import { StudentsService } from "./students.service";

@Module({
   controllers: [StudentsController],
   providers: [StudentsRepository, StudentsService, StorageService, StorageAPI],
})
export class StudentsModule {}
