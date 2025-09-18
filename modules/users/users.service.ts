import { HttpException, Injectable } from "@nestjs/common";
import { genTokenUserAuth, genTokenUserRecoveryPassword, validateToken } from "../../shared/utils/token";
import { CompaniesRepository } from "../companies/companies.repository";
import { MailsService } from "../mails/mails.service";
import { StorageService } from "../storage/storage.service";
import { UsersRepository } from "./users.repository";
const dev = (process.env.NODE_ENV || "development") === "development";
const crypto = require("crypto");

@Injectable()
export class UsersService {
   constructor(
      private readonly usersRepository: UsersRepository,
      private readonly companiesRepository: CompaniesRepository,
      private readonly mailsService: MailsService,
      private readonly storageService: StorageService
   ) {}

   async getAll() {
      return await this.usersRepository.findAll();
   }

   getById = async (id: string, companyId: string) => {
      return await this.usersRepository.findById(id, companyId);
   };

   createOrUpdate = async (data: any) => {
      return await this.usersRepository.createOrUpdate(data);
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

   async refreshToken(refreshToken: string) {
      //if development mode
      if (dev && refreshToken === process.env.DEV_TOKEN) {
         const userOne = (await this.usersRepository.findById("1")) as any;
         const company = (await this.companiesRepository.findById(userOne?.cod_empresa)) as any;

         return { token: refreshToken, usuario: userOne, empresa: company, validLicense: true };
      }

      if (!refreshToken) throw new HttpException("Token inválido", 401);
      const refreshTokenDB = (await this.usersRepository.findRefreshToken(refreshToken)) as any;
      if (!refreshTokenDB) throw new HttpException("Token inválido", 401);

      if (refreshTokenDB.expiresAt < new Date()) {
         await this.usersRepository.deleteRefreshToken(refreshToken);
         throw new HttpException("Token expirado", 401);
      }

      const user = (await this.usersRepository.findById(refreshTokenDB?.cod_usuario)) as any;
      const company = (await this.companiesRepository.findById(user?.cod_empresa)) as any;

      const { token } = await genTokenUserAuth(user.cod_usuario, user.cod_empresa);
      const {
         decoded: { status },
      } = validateToken(token);
      const validLicense = status !== "Expired" && status !== "Cancelled" && status !== undefined && status !== null;
      return { status: true, token, usuario: user, empresa: company, validLicense };
   }

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

      const newCompany = (await companiesRepository.createOrUpdate({
         nome_empresa: name,
         status_empresa: "Active",
         email_empresa: email,
         email_codigo: dev ? "1234" : emailCode,
      })) as any;

      const newUser = (await this.usersRepository.createOrUpdate({
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

   async recoveryAccount(email: string) {
      const user = (await this.usersRepository.findByEmail(email)) as any;

      if (!user) {
         throw new HttpException("Usuário não encontrado.", 404);
      }

      const token = genTokenUserRecoveryPassword(user.cod_usuario);
      const url = `https://app.fitcpx.com/recoveryPassword?token=${token}`;
      this.mailsService.recoveryPassword(user.nome_usuario, email, url);

      return;
   }

   async updatePassword(token: string, password: string) {
      try {
         const decoded = validateToken(token);
         if (!decoded.valid) {
            throw new HttpException("Token inválido", 401);
         }
         const userId = decoded.decoded.cod_usuario;
         return await this.usersRepository.updatePassword(password, userId);
      } catch (error) {
         throw new HttpException("Token inválido", 401);
      }
   }

   async resendConfirmationCode(companyId: string) {
      const companiesRepository = new CompaniesRepository();
      const company = (await companiesRepository.findById(companyId)) as any;

      if (!company) throw new HttpException("Empresa não encontrada.", 404);
      return this.mailsService.confirmationCode(company.nome_empresa, company.email_empresa, company.email_codigo);
   }

   async updateImageUser(userId: string, fileBuffer: Express.Multer.File) {
      if (!fileBuffer) throw new HttpException("Arquivo não enviado.", 400);

      const key = `${dev ? "developer/" : ""}usuario/perfil/${Date.now()}_${fileBuffer.originalname}`;
      const url = await this.storageService.uploadFile(fileBuffer, key);

      this.usersRepository.updateImageUser(userId, url);
      return url;
   }
}
