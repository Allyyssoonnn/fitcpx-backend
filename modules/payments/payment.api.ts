import { Injectable } from "@nestjs/common";
import moment from "moment-timezone";
const dev = process.env.NODE_ENV != "production";

const tokenAPI = dev
   ? process.env.ASAAS_KEY_DEVELOPMENT
   : "[REDACTED_CREDENTIAL]";
const urlBase = dev ? "https://api-sandbox.asaas.com/" : "https://api.asaas.com/";

@Injectable()
export class PaymentAPI {
   token: string | undefined;
   coreURL: string = "";
   constructor() {
      this.token = tokenAPI;
      this.coreURL = urlBase;
   }

   async fetchJson(url: string, options: any) {
      try {
         const response = await fetch(url, options);
         if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText} - ${errorBody}`);
         }
         return await response.json();
      } catch (error: any) {
         console.error("Erro fetchJson:", error.message);
         throw error;
      }
   }

   async createPayment(
      customerId: string | null,
      cod: string,
      value: number | null,
      dueDate: string | null,
      installments: number | null,
      billingType: string,
      name: string
   ) {
      const url = `${this.coreURL}/v3/payments/`;
      const body = {
         billingType, // 'CREDIT_CARD', 'PIX', 'BOLETO'
         customer: customerId,
         value: value,
         dueDate: moment(dueDate).tz("America/Sao_Paulo").format("YYYY-MM-DD"),
         description: name || "FitCpx",
         externalReference: cod,
         postalService: false,
         discount: { type: "PERCENTAGE", value: 0 },
         interest: { value: 0 },
         fine: { value: 0, type: "FIXED" },
      } as any;

      if (billingType === "CREDIT_CARD") {
         body.installmentCount = installments || 1;
         body.totalValue = value;
         // body.creditCardToken = tokenCartao;
         body.remoteIp = null;
         body.callback = {
            successUrl: "https://fitcpx.com",
            autoRedirect: false,
         };
         body.creditCardHolderInfo = {
            addressComplement: null,
            phone: null,
            mobilePhone: null,
         };
      }

      const options = {
         method: "POST",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
         body: JSON.stringify(body),
      };

      const resp = await this.fetchJson(url, options);

      return resp;
   }

   async createSignature(
      customerId: string | null,
      cod: string,
      value: number,
      dueDate: string | null,
      installments: number | null,
      billingType: string,
      name: string
   ) {
      const url = `${urlBase}/v3/subscriptions`;
      const options = {
         method: "POST",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
         body: JSON.stringify({
            billingType: billingType,
            cycle: "MONTHLY",
            description: name || "FitCpx",
            externalReference: cod,
            customer: customerId,
            value: value,
            nextDueDate: dueDate,
            maxPayments: installments,
         }),
      };

      const resp = await this.fetchJson(url, options);
      return resp;
   }

   async newClient(
      nome: string,
      email: string,
      documento: string,
      telefone: string,
      endereco: string,
      numero: string,
      estado: string,
      cep: string,
      cod: string,
      nome_empresa: string = ""
   ) {
      const url = `${this.coreURL}/v3/customers`;
      const options = {
         method: "POST",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
         body: JSON.stringify({
            name: nome,
            cpfCnpj: documento?.replace(/[^\d]+/g, ""),
            email: email,
            phone: telefone,
            address: endereco,
            addressNumber: numero,
            province: estado,
            postalCode: cep,
            externalReference: cod,
            company: nome_empresa,
            groupName: nome_empresa,
            notificationDisabled: true,
         }),
      };

      const resp = await this.fetchJson(url, options);

      return resp.id;
   }

   async updateClient(customerId: string, nome: string, documento: string, email: string, telefone: string) {
      const url = `${this.coreURL}/v3/customers/${customerId}`;
      const options = {
         method: "PUT",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
         body: JSON.stringify({
            name: nome,
            cpfCnpj: documento.replace(/[^\d]+/g, ""),
            email: email,
            phone: telefone,
         }),
      };

      const response = await this.fetchJson(url, options);

      return;
   }

   async findInvoice(id: string) {
      const url = `${this.coreURL}/v3/payments/${id}`;
      const options = {
         method: "POST",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
      };

      const resp = await this.fetchJson(url, options);

      return resp;
   }

   private async findSignature(SignatureId: string) {
      const url = `${this.coreURL}/v3/subscriptions/${SignatureId}`;
      const options = {
         method: "POST",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
      };

      const resp = await this.fetchJson(url, options);

      return resp;
   }

   private async findInstallment(installmentId: string) {
      const url = `${this.coreURL}/v3/installments/${installmentId}`;
      const options = {
         method: "GET",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
      };

      const resp = await this.fetchJson(url, options);

      return resp;
   }

   async deleteInoice(invoiceId: string) {
      const cobranca = await this.findInvoice(invoiceId);
      if (!cobranca || cobranca?.status !== "PENDING") return;
      const url = `${this.coreURL}/v3/payments/${invoiceId}`;
      const options = {
         method: "DELETE",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
      };

      const resp = await this.fetchJson(url, options);
      return resp;
   }

   private async deleteSignature(signatureId: string) {
      const assinatura = await this.findSignature(signatureId);
      if (!assinatura || assinatura?.status !== "ACTIVE") return;
      const url = `${this.coreURL}/v3/subscriptions/${signatureId}`;
      const options = {
         method: "DELETE",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
      };

      const resp = await this.fetchJson(url, options);
      return resp;
   }

   async deleteInstallment(installmentId: string) {
      const parcelamento = await this.findInstallment(installmentId);
      if (!parcelamento || !parcelamento?.deleted) return;
      const url = `${this.coreURL}/v3/installments/${installmentId}`;
      const options = {
         method: "DELETE",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
      };

      const resp = await this.fetchJson(url, options);
      return resp;
   }

   async deleteSignatureOrInstallment(id: string) {
      var resp;
      if (id.substring(0, 4) === "sub_") {
         resp = await this.deleteSignature(id);
      }

      if (id.substring(0, 4) === "pay_") {
         return resp;
      }

      resp = await this.deleteInstallment(id);

      return resp;
   }

   async markPaymentReceived(id: string) {
      const cobranca = await this.findInvoice(id);
      if (!cobranca) return;
      const url = `${urlBase}/v3/payments/${id}/receiveInCash`;
      const options = {
         method: "POST",
         headers: { accept: "application/json", "content-type": "application/json", access_token: this.token },
         body: JSON.stringify({
            paymentDate: new Date(),
            value: cobranca?.value,
         }),
      };

      const resp = await this.fetchJson(url, options);
      return resp;
   }
}
