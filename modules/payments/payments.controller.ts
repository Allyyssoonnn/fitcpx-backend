import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller("payments")
export class PaymentsController {
   constructor(private readonly paymentsService: PaymentService) {}

   @Post("markPaymentReceived")
   async markPaymentReceived(@Body() body: any) {
      const { paymentId } = body;
      return this.paymentsService.markPaymentReceived(paymentId);
   }
}
