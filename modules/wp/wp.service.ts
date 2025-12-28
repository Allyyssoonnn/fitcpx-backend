import { Injectable } from "@nestjs/common";
import { WPAPI } from "./wp.api";
import { WPRepository } from "./wp.repository";
import { paymentOverdue, replaceVariables, sentPayout } from "./wp.template";

@Injectable()
export class WPService {
   constructor(private readonly wpAPI: WPAPI, private readonly wpRepository: WPRepository) {}

   async sendPaymentOverdue(
      number: string,
      name: string,
      value: string,
      description: string,
      date: string,
      url: string,
      support: string
   ) {
      const message = replaceVariables(paymentOverdue, { name, value, description, date, url, support });
      const response = await this.wpAPI.sendMessage(number, message, 3000);
      this.wpRepository.create(number, message, JSON.stringify(response));
      return response;
   }

   async sendPayout(
      number: string,
      proof: Buffer,
      name: string,
      startDate: string,
      endDate: string,
      value: string,
      proofURL: string
   ) {
      const message = replaceVariables(sentPayout, { name, value, startDate, endDate });

      const response = await this.wpAPI.sendPdf(number, proof, "Comprovante.pdf", message);
      this.wpRepository.create(number, message, JSON.stringify(response), proofURL);

      return response;
   }
}
