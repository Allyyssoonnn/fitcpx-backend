import { HttpException, Injectable } from "@nestjs/common";
import { genTokenUserAuth } from "../../shared/utils/token";
import { CompaniesRepository } from "../companies/companies.repository";
import { UsersRepository } from "../users/users.repository";
import { GoogleAPI } from "./google.api";
const crypto = require("crypto");

@Injectable()
export class GoogleService {
   constructor(
      private readonly googleAPI: GoogleAPI,
      private readonly companiesRepository: CompaniesRepository,
      private readonly usersRespository: UsersRepository
   ) {}

   async getGoogleUrlLogin() {
      return await this.googleAPI.getURL();
   }

   async loggedGoogle(code: string) {
      const data = await this.googleAPI.connected(code, "entrar");

      if (!data?.email) {
         throw new HttpException("Falha na autenticação!", 400);
      }

      const user = (await this.usersRespository.findByEmail(data.email.trim())) as any;

      if (!user) {
         //Cria novo usuário com o google
         const company = (await this.companiesRepository.createOrUpdate({
            nome_empresa: data?.name,
            email_empresa: data.email.trim(),
            //Id do E-mail do google
            email_codigo: data?.id,
         })) as any;
         const newUser = (await this.usersRespository.createOrUpdate({
            nome_usuario: data?.name,
            email_usuario: data.email.trim(),
            senha_usuario: [...crypto.randomFillSync(Buffer.alloc(8))]
               .map((n) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[n % 36])
               .join(""),
            imagem_usuario: data?.picture,
            cod_empresa: company.cod_empresa,
            admin_usuario: "S",
         })) as any;

         const { token, refreshToken } = await genTokenUserAuth(newUser.cod_usuario, company.cod_empresa);
         return { status: true, token, refreshToken, usuario: newUser };
      } else {
         //Faz login do usuário com o google
         const empresa = (await this.companiesRepository.findById(user.cod_empresa)) as any;
         const { token, refreshToken } = await genTokenUserAuth(user.cod_usuario, empresa.cod_empresa);
         return { token, refreshToken, usuario: user, empresa };
      }
   }
}
