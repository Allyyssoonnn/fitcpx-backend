const tokenAPI = "[REDACTED_CREDENTIAL]";

export class CRMAPI {
   token: string | undefined;
   constructor() {
      this.token = tokenAPI;
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

   async createContact(companyId: number, number: string, name: string) {
      const body = {
         companyId,
         number,
         name,
         orders: {
            pipeline: "Comercial",
            step: "Entrada",
         },
      };

      const options = {
         method: "POST",
         headers: { accept: "application/json", "content-type": "application/json", "api-key": this.token },
         body: JSON.stringify(body),
      };

      return await this.fetchJson("https://api.genecrm.com.br/api/contact", options);
   }
}
