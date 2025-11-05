import { Body, Controller, Get, Post } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { UserId } from "../../shared/decorators/userId.decorator";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
   constructor(private readonly chatService: ChatService) {}

   @Get()
   async getMessages() {
      return this.chatService.findAll();
   }

   @Post("sendUserMessage")
   async sendUserMessage(
      @UserId() userId: string,
      @CompanyId() companyId: string,
      @Body("message") message: string,
      @Body("studentId") studentId: string
   ) {
      return this.chatService.registerUserMessage(userId, companyId, message, studentId);
   }
}
