import { Injectable } from "@nestjs/common";
import { literal, Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class ChatRepository {
   async findAll(studentId: string) {
      var where = { studentId } as any;
      return await db.chat.findAll({
         where,
         include: [
            { model: db.tab_empresa, as: "company", attributes: ["nome_empresa"] },
            { model: db.tab_aluno, as: "student", attributes: ["nome_aluno"] },
         ],
      });
   }

   async getMessages(studentId: string) {
      return db.chat.findAll({
         where: { studentId },
         include: [
            { model: db.tab_aluno, as: "student", attributes: ["nome_aluno"] },
            { model: db.tab_usuario, as: "user", attributes: ["nome_usuario"] },
         ],
         attributes: {
            include: [
               [db.Sequelize.col("student.nome_aluno"), "studentName"],
               [db.Sequelize.col("user.nome_usuario"), "userName"],
            ],
         },
         raw: true,
      });
   }

   async getPreviewMessages(companyId: string) {
      const chatTable = db.chat.tableName;
      return db.chat.findAll({
         where: {
            companyId,
            id: {
               [Op.in]: literal(
                  // CORRIGIDO: Use crases (`) para MySQL, não aspas (")
                  `(SELECT MAX(\`id\`) 
                  FROM \`${chatTable}\` 
                  WHERE \`companyId\` = :companyId 
                  GROUP BY \`studentId\`)`
               ),
            },
         },
         replacements: { companyId },
         include: [{ model: db.tab_aluno, as: "student", attributes: ["nome_aluno"] }],
         attributes: {
            include: [[db.Sequelize.col("student.nome_aluno"), "studentName"]],
         },
         group: ["chat.studentId", "student.nome_aluno"],
         raw: true,
         order: [["createdAt", "DESC"]],
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

   async markReadCompany(studentId?: string) {
      return await db.chat.update({ status: "read" }, { where: { studentId, from: "student" } });
   }

   async create(message: string, companyId: string, studentId: string, from: "student" | "company", userId?: string) {
      return await db.chat.create({
         message: message,
         studentId: studentId,
         companyId: companyId,
         userId: userId,
         from: from,
      });
   }
}
