import { Module } from "@nestjs/common";
import { StorageAPI } from "./storage.api";
import { StorageService } from "./storage.service";

@Module({
   providers: [StorageService, StorageAPI],
   exports: [StorageService],
})
export class StorageModule {}
