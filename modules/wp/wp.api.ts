const dev = process.env.NODE_ENV !== "production";

const instanceTokenRaw = "[REDACTED_CREDENTIAL]";
const instanceNameRaw = "FitBot";

export class WPAPI {
   instanceToken: string | undefined;
   instanceName: string | undefined;

   constructor() {
      this.instanceToken = instanceTokenRaw;
      this.instanceName = instanceNameRaw;
   }

   /**
    * Formata o número para o padrão JID do WhatsApp (apenas números + sufixo)
    */
   private formatToJid(number: string): string {
      const cleanNumber = number.replace(/\D/g, "");
      if (cleanNumber.includes("@s.whatsapp.net")) {
         return cleanNumber;
      }
      return `${cleanNumber}@s.whatsapp.net`;
   }

   async fetchJson(url: string, options: any) {
      try {
         const response = await fetch(url, options);
         if (!response.ok) {
            const errorBody = await response.text();
            console.log(errorBody);
            return JSON.parse(errorBody);
         }
         return await response.json();
      } catch (error: any) {
         console.log(error);
         console.error(`Erro fetchJson: ${url}`, error.message);
         return error;
      }
   }

   /**
    * Envia uma mensagem de template
    * @param number Número do destinatário (ex: '5544988084028')
    * @param message Mensagem a ser enviada
    * @param delay Espera para envio
    */
   async sendMessage(number: string, message: string, delay: number = 3000, checkDuplicate: boolean = true) {
      if (checkDuplicate) {
         const isDupe = await this.isLastMessageSame(number, message);
         if (isDupe) {
            console.log(`[WPAPI] Mensagem duplicada evitada para ${number}.`);
            return { status: "IGNORED", reason: "DUPLICATE_MESSAGE" };
         }
      }
      const url = `https://evo.fitcpx.com/message/sendText/${this.instanceName}`;
      const options = {
         method: "POST",
         headers: {
            apikey: this.instanceToken,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            number: dev ? "5544988084028" : number,
            text: dev ? `[dev] - ${message}` : message,
            delay: delay,
            linkPreview: true,
         }),
      };

      return await this.fetchJson(url, options);
   }

   /**
    * Verifica se a última mensagem enviada/recebida é igual ao texto atual
    * @param number Número do destinatário
    * @param newMessage Texto da nova mensagem que seria enviada
    * @returns true se for duplicada, false se for segura para enviar
    */
   async isLastMessageSame(number: string, newMessage: string): Promise<boolean> {
      const url = `https://evo.fitcpx.com/chat/findMessages/${this.instanceName}`;
      const remoteJid = this.formatToJid(number);

      const options = {
         method: "POST",
         headers: {
            apikey: this.instanceToken,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            where: {
               key: {
                  remoteJid: remoteJid,
               },
            },
            options: {
               limit: 5, // Busca as ultimas 5 para garantir
               sort: "DESC", // Tenta pegar as mais recentes primeiro
            },
         }),
      };

      try {
         const result = await this.fetchJson(url, options);

         // A Evolution retorna um array de mensagens
         // Precisamos validar se 'result' é um array e tem itens
         if (Array.isArray(result) && result.length > 0) {
            // Ordena por timestamp decrescente (mais novo primeiro) via JS para garantir
            const sortedMessages = result.sort(
               (a: any, b: any) => (b.messageTimestamp || 0) - (a.messageTimestamp || 0)
            );

            const lastMessageObj = sortedMessages[0];

            // Extrai o conteúdo de texto da mensagem (pode vir em conversation ou extendedTextMessage)
            const lastContent =
               lastMessageObj.message?.conversation || lastMessageObj.message?.extendedTextMessage?.text || "";

            if (!lastContent) return false;

            // Compara as mensagens removendo espaços em branco extras
            return lastContent.trim() === newMessage.trim();
         }

         return false; // Nenhuma mensagem encontrada, não é duplicada
      } catch (error) {
         console.error("Erro ao verificar duplicidade:", error);
         return false; // Na dúvida, permite o envio (fail-safe)
      }
   }

   /**
    * Envia um arquivo PDF (convertendo Buffer para Base64)
    * @param number Número do destinatário
    * @param fileBuffer O buffer do arquivo recebido pelo Multer
    * @param fileName Nome do arquivo (ex: 'comprovante.pdf')
    * @param caption (Opcional) Texto que acompanha o arquivo
    */
   async sendPdf(number: string, fileBuffer: Buffer, fileName: string, caption: string = "") {
      const url = `https://evo.fitcpx.com/message/sendMedia/${this.instanceName}`;

      // 1. Converte o Buffer do arquivo para Base64
      const base64 = fileBuffer.toString("base64");

      // --- CORREÇÃO AQUI ---
      // Mesmo que você ache que o número está certo, vamos garantir.
      // 1. Remove tudo que não for número
      let cleanNumber = number.replace(/\D/g, "");

      // 2. Se tiver apenas 10 ou 11 dígitos (DDD + Numero), adiciona o 55 (Brasil)
      // Ex: 44988084028 vira 5544988084028
      if (cleanNumber.length >= 10 && cleanNumber.length <= 11) {
         cleanNumber = "55" + cleanNumber;
      }
      //

      const options = {
         method: "POST",
         headers: {
            apikey: this.instanceToken,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            number: dev ? "5544988084028" : cleanNumber,
            mediatype: "document", // "document" força o envio como arquivo/anexo
            mimetype: "application/pdf",
            caption: caption,
            fileName: fileName, // Nome que aparecerá para o usuário no WhatsApp
            media: base64, // O conteúdo do arquivo em si
         }),
      };

      return await this.fetchJson(url, options);
   }
}
