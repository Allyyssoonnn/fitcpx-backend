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

   async findById(id: string) {
      return await db.tab_agenda.findByPk(id);
   }

   async findEvents(studentId: string, companyId: string) {
      const company = (await db.tab_empresa.findByPk(companyId)) as any;
      const phone = company ? company.telefone_empresa : null;
      const currentDate = new Date();

      const events = (await db.tab_agenda.findAll({
         where: {
            cod_aluno: { [Op.or]: [studentId, null] },
            data_fim: { [Op.gte]: currentDate },
         },
         include: [
            { model: db.tab_modalidade, as: "modalidade" },
            { model: db.tab_usuario, as: "usuario" },
         ],
         order: [["data_inicio", "ASC"]],
      })) as any[];

      return events.map((event) => {
         const text = encodeURIComponent("Olá, gostaria de ajustar o agendamento.");
         const url = `https://wa.me/${phone}?text=${text}`;
         event.url = url;

         return { ...event.toJSON(), url: event.url };
      });
   }

   async scheduleEvent(studentId: string, eventId: string) {
      return db.tab_agenda.update({ cod_aluno: studentId }, { where: { cod_agenda: eventId } });
   }
}
