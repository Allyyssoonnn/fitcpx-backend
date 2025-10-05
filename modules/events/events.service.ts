import { Injectable } from "@nestjs/common";
import { MailsService } from "../mails/mails.service";

@Injectable()
export class EventsService {
   constructor(private readonly mailsService: MailsService) {}

   async recoveryPasswordUser(name: string, email: string, url: string) {
      return this.mailsService.sendMail(email, "recoveryPassword.html", "Recuperação de senha", {
         name,
         url,
         email,
      });
   }
}
