import { Injectable } from "@nestjs/common";
import { ChatRepository } from "./chat.repository";

@Injectable()
export class ChatService {
   constructor(private readonly chatRepository: ChatRepository) {}

   async getMessages(studentId: string) {
      await this.chatRepository.markReadCompany(studentId);
      return this.chatRepository.getMessages(studentId);
   }

   async getPreviewMessages(companyId: string) {
      return this.chatRepository.getPreviewMessages(companyId);
   }

   async registerUserMessage(userId: string, companyId: string, message: string, studentId: string) {
      return this.chatRepository.create(message, companyId, studentId, "company", userId);
   }

   async getUnreadMessages(companyId: string, studentId: string) {
      return this.chatRepository.countUnreadMessages(studentId, companyId);
   }
}
