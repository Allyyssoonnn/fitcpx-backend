import { Injectable } from "@nestjs/common";
import { google } from "googleapis";

const env = process.env.NODE_ENV || "development";
const urlCallback = env == "development" ? "http://localhost:5173/" : "https://app.fitcpx.com/";

// const secretKey = "[REDACTED_CREDENTIAL]";
// const clientId = "129544337181-7rr6i6ban2p64sjuub2jd6jpcr6cucnt.apps.googleusercontent.com";
const secretKey = "[REDACTED_CREDENTIAL]";
const clientId = "744947823522-tqesrbc87egn9999rq2t5dqghr5s68gs.apps.googleusercontent.com";

@Injectable()
export class GoogleAPI {
   secretKey: string;
   clientId: string;

   constructor() {
      this.secretKey = secretKey;
      this.clientId = clientId;
   }

   async getURL(rotaCallback: string = "entrar") {
      const urlRedirect = `${urlCallback}${rotaCallback}`;
      const oauth2Client = new google.auth.OAuth2(this.clientId, this.secretKey, urlRedirect);

      var scope: any[] = [];

      if (rotaCallback == "agenda")
         scope = [
            ...scope,
            "https://www.googleapis.com/auth/calendar.events", // Permite criar, editar e excluir eventos
         ];
      if (rotaCallback == "entrar")
         scope = [
            ...scope,
            "https://www.googleapis.com/auth/userinfo.email", // Para acessar o email
            "https://www.googleapis.com/auth/userinfo.profile", // Para acessar o nome e foto do usuário (opcional)
         ];

      const authOptions = {
         access_type: "offline",
         scope: scope,
         prompt: "",
      };

      // Adiciona o prompt apenas se for "agenda"
      if (rotaCallback == "agenda") {
         authOptions.prompt = "consent";
      }

      const url = oauth2Client.generateAuthUrl(authOptions);

      return url;
   }

   async connected(code: string, rotaCallback: string) {
      const urlRedirect = `${urlCallback}${rotaCallback}`;
      const oauth2Client = new google.auth.OAuth2(clientId, secretKey, urlRedirect);
      const { tokens } = await oauth2Client.getToken(code);
      const access_token = tokens.access_token;
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });

      const { data } = await oauth2.userinfo.get(); // Obtem o email do usuário

      return { ...data, token: access_token, refresh_token: tokens.refresh_token, expiresAt: tokens.expiry_date };
   }
}
