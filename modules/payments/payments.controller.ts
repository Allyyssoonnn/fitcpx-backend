import { Body, Controller, Get, Post } from "@nestjs/common";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { PaymentService } from "./payment.service";

@Controller("payments")
export class PaymentsController {
   constructor(private readonly paymentsService: PaymentService) {}

   @Post("markPaymentReceived")
   async markPaymentReceived(@Body() body: any) {
      const { paymentId } = body;
      return this.paymentsService.markPaymentReceived(paymentId);
   }

   @Get("getNextPayout")
   async getNextPayout(@CompanyId() companyId: string) {
      return this.paymentsService.getNextPayout(companyId);
   }
}
