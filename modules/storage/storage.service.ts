import { Injectable } from "@nestjs/common";
import { StorageAPI } from "./storage.api";

@Injectable()
export class StorageService {
   constructor(private readonly storageAPI: StorageAPI) {}

   async uploadFile(fileBuffer: Express.Multer.File, key: string) {
      return this.storageAPI.uploadFile(fileBuffer, key);
   }
}
