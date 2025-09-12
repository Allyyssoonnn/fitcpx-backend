import { HttpException, Injectable } from "@nestjs/common";
import { genTokenUserAuth, validateToken } from "../../utils/token";
import { CompaniesRepository } from "../companies/companies.repository";
import { MailsService } from "../mails/mails.service";
import { UsersRepository } from "./users.repository";
const dev = (process.env.NODE_ENV || "development") === "development";
const crypto = require("crypto");

@Injectable()
export class UsersService {
   constructor(private readonly usersRepository: UsersRepository, private readonly mailsService: MailsService) {}

   async getAll() {
      return await this.usersRepository.findAll();
   }

   getById = async (id: string, companyId: string) => {
      return await this.usersRepository.findById(id, companyId);
   };

   create = async (data: any) => {
      return await this.usersRepository.create(data);
   };

   login = async (email: string, password: string) => {
      const user = (await this.usersRepository.findByEmail(email)) as any;
      const empresa = await new CompaniesRepository().findById(user?.cod_empresa);

      if (!user || user?.senha_usuario !== password) {
         throw new HttpException("Credenciais inválidas.", 401);
      }

      const { token, refreshToken } = await genTokenUserAuth(user.cod_usuario, user.cod_empresa);

      const {
         decoded: { status },
      } = validateToken(token);

      const validLicense = status !== "Expired" && status !== "Cancelled" && status !== undefined && status !== null;
      return { token, refreshToken, usuario: user, empresa: empresa, validLicense };
   };

   register = async (name: string, email: string, password: string) => {
      const companiesRepository = new CompaniesRepository();

      const company = await companiesRepository.findByEmail(email);
      const user = await this.usersRepository.findByEmail(email);

      if (user || company) {
         throw new HttpException("Usuário já existe.", 406);
      }

      const emailCode = [...crypto.randomFillSync(Buffer.alloc(4))]
         .map((n) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[n % 36])
         .join("");

      this.mailsService.confirmationCode(name, email, emailCode);

      const newCompany = (await companiesRepository.create({
         nome_empresa: name,
         status_empresa: "Active",
         email_empresa: email,
         email_codigo: dev ? "1234" : emailCode,
      })) as any;

      const newUser = (await this.usersRepository.create({
         nome_usuario: name,
         email_usuario: email,
         senha_usuario: password,
         cod_empresa: newCompany?.cod_empresa,
         admin_usuario: "S",
      })) as any;

      const { token, refreshToken } = await genTokenUserAuth(newUser?.cod_usuario, newCompany.cod_empresa);

      const {
         decoded: { status },
      } = validateToken(token);

      const validLicense = status !== "Expired" && status !== "Cancelled" && status !== undefined && status !== null;
      return { token, refreshToken, usuario: newUser, empresa: newCompany, validLicense };
   };
}
