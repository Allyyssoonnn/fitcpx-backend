import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class CalendarRepository {
   async findAll(companyId: string, studentId?: string) {
      const where = { cod_empresa: companyId } as any;
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);
      if (studentId) {
         where.cod_aluno = studentId;
         where.data_inicio = { [Op.between]: [startDate, endDate] };
      }
      return db.tab_agenda.findAll({
         where,
         include: [
            { model: db.tab_modalidade, as: "modalidade" },
            { model: db.tab_usuario, as: "usuario" },
         ],
      });
   }

   async createEvent(data: any) {
      return (await db.tab_agenda.upsert(data))[0];
   }
}
