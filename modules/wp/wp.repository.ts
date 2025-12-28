import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class WPRepository {
   constructor() {}

   async create(phone: string, message: string, response: string, attach?: string) {
      return db.wp_messages.create({ phone, message, attach, response });
   }
}
