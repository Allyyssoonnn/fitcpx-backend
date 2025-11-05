import { Injectable } from "@nestjs/common";
import { ChatRepository } from "./chat.repository";

@Injectable()
export class ChatService {
   constructor(private readonly chatRepository: ChatRepository) {}

   async findAll() {
      return this.chatRepository.findAll();
   }

   async registerUserMessage(userId: string, companyId: string, message: string, studentId: string) {
      return this.chatRepository.create(message, companyId, studentId, "company", userId);
   }
}
