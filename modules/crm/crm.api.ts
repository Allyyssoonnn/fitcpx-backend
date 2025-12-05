const instanceTokenRaw = "[REDACTED_CREDENTIAL]";
const instanceNameRaw = "FitCpx";

export class CRMAPI {
   instanceToken: string | undefined;
   instanceName: string | undefined;
   constructor() {
      this.instanceToken = instanceTokenRaw;
      this.instanceName = instanceNameRaw;
   }

   async fetchJson(url: string, options: any) {
      try {
         const response = await fetch(url, options);
         if (!response.ok) {
            const errorBody = await response.text();
            return JSON.parse(errorBody);
         }
         return await response.json();
      } catch (error: any) {
         console.log(error);
         console.error(`Erro fetchJson: ${url}`, error.message);
         return error;
      }
   }

   async sendMessage(number: string, message: string, delay: number = 3000) {
      const url = `https://evo.fitcpx.com/message/sendText/${this.instanceName}`;
      const options = {
         method: "POST",
         headers: {
            apikey: this.instanceToken,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            number: number,
            text: message,
            delay: delay,
            linkPreview: true,
            // mentionsEveryOne: true,
            // mentioned: ["{{remoteJID}}"],
            // quoted: { key: { id: "<string>" }, message: { conversation: "<string>" } },
         }),
      };

      return await this.fetchJson(url, options);

      // fetch("https://evo.fitcpx.com/message/sendText/Alyson", options)
      //    .then((res) => res.json())
      //    .then((res) => console.log(res))
      //    .catch((err) => console.error(err));
   }

   async checkIsWhatsapp(numberRaw: string) {
      const number = numberRaw.replace(/\D+/g, "");
      const url = `https://evo.fitcpx.com/chat/whatsappNumbers/${this.instanceName}`;

      const options = {
         method: "POST",
         headers: { apikey: "123", "Content-Type": "application/json" },
         body: JSON.stringify({ numbers: [number] }),
      };

      const response = await this.fetchJson(url, options);

      if (response && response[0] && response[0].exists) return response[0].exists;
      return false;
   }
}
