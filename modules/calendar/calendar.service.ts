import { Injectable } from "@nestjs/common";
import { CalendarRepository } from "./calendar.repository";

@Injectable()
export class CalendarService {
   constructor(private readonly calendarRepository: CalendarRepository) {}

   async getCalendar(companyId: string, studentId?: string) {
      return this.calendarRepository.findAll(companyId, studentId);
   }

   async createEvent(data: any) {
      return this.calendarRepository.createEvent(data);
   }
}
