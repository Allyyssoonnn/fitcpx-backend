import { Controller, Get, Query } from "@nestjs/common";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
   constructor(private readonly eventsService: EventsService) {}

   @Get("confirmedPayment")
   async confirmedPayment(@Query("paymentContractId") id: string) {
      return this.eventsService.confirmedPayment(null, id);
   }

   @Get("createdPayment")
   async createdPayment(@Query("paymentContractId") id: string) {
      return this.eventsService.createdPayment(id);
   }

   @Get("overduePayment")
   async overduePayment(@Query("paymentContractId") id: string) {
      return this.eventsService.overduePayment(id);
   }

   @Get("license/confirmedPayment")
   async confirmedPaymentLicense(@Query("paymentId") id: string) {
      return this.eventsService.confirmedPaymentLicense(id);
   }

   @Get("license/createdPayment")
   async createdPaymentLicense(@Query("paymentId") id: string) {
      return this.eventsService.createdPaymentLicense(id);
   }

   @Get("license/overduePayment")
   async overduePaymentLicense(@Query("paymentId") id: string) {
      return this.eventsService.overduePaymentLicense(id);
   }

   @Get("contract/contractSigned")
   async contractSigned(@Query("documentId") id: string) {
      return this.eventsService.contractSigned(id);
   }
}
