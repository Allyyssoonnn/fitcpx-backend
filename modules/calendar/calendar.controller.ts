import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CompanyId } from "../../decorators/companyId.decorator";
import { CalendarService } from "./calendar.service";

@Controller("calendar")
export class CalendarController {
   constructor(private readonly calendarService: CalendarService) {}

   @Get()
   async getCalendar(@CompanyId() companyId: string, @Query("studentId") studentId: string) {
      return this.calendarService.getCalendar(companyId, studentId);
   }

   @Post("newEvent")
   async newEvent(@Body() body: any) {
      return this.calendarService.createEvent(body);
   }
}
