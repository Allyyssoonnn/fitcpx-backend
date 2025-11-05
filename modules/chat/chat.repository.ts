import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class ChatRepository {
   async findAll(studentId?: string) {
      var where = {} as any;
      if (studentId) where.studentId = studentId;
      return await db.chat.findAll({
         where,
         include: [
            { model: db.tab_empresa, as: "company", attributes: ["nome_empresa"] },
            { model: db.tab_aluno, as: "student", attributes: ["nome_aluno"] },
         ],
      });
   }

   async countUnreadMessages(studentId?: string) {
      var where = { status: "unread" } as any;
      if (studentId) {
         where.studentId = studentId;
         where.from = "company";
      }
      return await db.chat.count({ where });
   }

   async markReadStudent(studentId?: string) {
      return await db.chat.update({ status: "read" }, { where: { studentId, from: "company" } });
   }

   async create(message: string, companyId: string, studentId: string, from: "student" | "company", userId?: string) {
      return await db.chat.create({
         message: message,
         studentId: studentId,
         companyId: companyId,
         userId: userId,
      });
   }
}
