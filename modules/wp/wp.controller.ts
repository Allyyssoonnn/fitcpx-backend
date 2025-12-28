import { Controller, Get } from "@nestjs/common";
import { WPService } from "./wp.service";

@Controller("wp")
export class WPController {
   constructor(private readonly wpService: WPService) {}

   @Get("test")
   async testWP() {
      return this.wpService.sendPaymentOverdue(
         "5544988084028",
         "Alyson",
         "R$ 30,00",
         "Test Message",
         "20/12/2025",
         "https://asaas.com/i/4jpbjjlzl17p1y75",
         "http://wa.me/5544988084028"
      );
   }
}
