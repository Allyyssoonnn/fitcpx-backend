import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class MailsRepository {
   async createOrUpdate({
      content,
      subject,
      status,
      errorMessage,
      studentId,
      comapanyId,
      email,
   }: {
      content: string;
      subject: string;
      status?: string | null;
      errorMessage?: string;
      studentId?: string;
      comapanyId?: string;
      email: string;
   }) {
      return (await db.mails.upsert({ content, subject, status, errorMessage, studentId, comapanyId, email }))[0];
   }
}
