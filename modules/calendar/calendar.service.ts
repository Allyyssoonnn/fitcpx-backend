import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ServicesRepository } from "../services/services.repository";
import { CalendarRepository } from "./calendar.repository";

@Injectable()
export class CalendarService {
   constructor(
      private readonly calendarRepository: CalendarRepository,
      private readonly servicesRepostory: ServicesRepository,
      private readonly eventEmitter: EventEmitter2,
   ) {}

   async getCalendar(companyId: string, studentId?: string) {
      return this.calendarRepository.findAll(companyId, studentId);
   }

   async createEvent(data: any) {
      const eventDB = data;
      if (data.cod_modalidade) {
         const service = (await this.servicesRepostory.findById(data.cod_modalidade)) as any;
         if (service) {
            eventDB.nome_evento = service.nome_modalidade;
            eventDB.descricao_evento = service.descricao_modalidade;
            eventDB.cor_evento = service.cor_modalidade;
         }
      }
      const response = (await this.calendarRepository.createEvent(eventDB)) as any;
      if (response?.cod_aluno && !data?.cod_evento && response?.cod_aluno) {
         await this.eventEmitter.emitAsync("new.schedule", response.cod_aluno);
      }
      return response;
   }
}
