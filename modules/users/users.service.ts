import { HttpException, Injectable } from "@nestjs/common";
import { genTokenUserAuth, genTokenUserRecoveryPassword, validateToken } from "../../shared/utils/token";
import { CompaniesRepository } from "../companies/companies.repository";
import { EventsService } from "../events/events.service";
import { StorageService } from "../storage/storage.service";
import { UsersRepository } from "./users.repository";
const dev = process.env.NODE_ENV !== "production";
const crypto = require("crypto");

@Injectable()
export class UsersService {
   constructor(
      private readonly usersRepository: UsersRepository,
      private readonly companiesRepository: CompaniesRepository,
      private readonly eventsService: EventsService,
      private readonly storageService: StorageService
   ) {}

   async getAll(companyId: string) {
      return await this.usersRepository.findAll(companyId);
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

      const { token, refreshToken, license } = await genTokenUserAuth(user.cod_usuario, user.cod_empresa);

      return { token, refreshToken, usuario: user, empresa: empresa, license };
   };

   async refreshToken(refreshTokenReq: string) {
      //if development mode
      if (dev && refreshTokenReq === process.env.DEV_TOKEN) {
         const userOne = (await this.usersRepository.findById("1")) as any;
         const company = (await this.companiesRepository.findById(userOne?.cod_empresa)) as any;

         return { token: refreshTokenReq, usuario: userOne, empresa: company };
      }

      if (!refreshTokenReq) throw new HttpException("Token inválido", 401);
      const refreshTokenDB = (await this.usersRepository.findRefreshToken(refreshTokenReq)) as any;
      if (!refreshTokenDB) throw new HttpException("Token inválido", 401);

      if (refreshTokenDB.expiresAt < new Date()) {
         await this.usersRepository.deleteRefreshToken(refreshTokenReq);
         throw new HttpException("Token expirado", 401);
      }

      const user = (await this.usersRepository.findById(refreshTokenDB?.cod_usuario)) as any;
      const company = (await this.companiesRepository.findById(user?.cod_empresa)) as any;

      const { token, refreshToken, license } = await genTokenUserAuth(user.cod_usuario, user.cod_empresa);
      await this.usersRepository.deleteRefreshToken(refreshTokenReq);

      return { license, token, refreshToken, usuario: user, empresa: company };
   }

   register = async (name: string, email: string, password: string, phone: string) => {
      const companiesRepository = new CompaniesRepository();

      const company = await companiesRepository.findByEmail(email);
      const user = await this.usersRepository.findByEmail(email);

      if (user || company) {
         throw new HttpException("Usuário já existe.", 406);
      }

      const emailCode = [...crypto.randomFillSync(Buffer.alloc(4))]
         .map((n) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[n % 36])
         .join("");

      // this.mailsService.confirmationCode(name, email, emailCode);

      const newCompany = (await companiesRepository.createOrUpdate({
         nome_empresa: name,
         telefone_empresa: phone,
         status_empresa: "Active",
         email_empresa: email,
         email_codigo: dev ? "1234" : emailCode,
      })) as any;

      const newUser = (await this.usersRepository.createOrUpdate({
         nome_usuario: name,
         celular_usuario: phone,
         email_usuario: email,
         senha_usuario: password,
         cod_empresa: newCompany?.cod_empresa,
         admin_usuario: "S",
      })) as any;

      const { token, refreshToken, license } = await genTokenUserAuth(newUser?.cod_usuario, newCompany.cod_empresa);

      return { token, refreshToken, usuario: newUser, empresa: newCompany, license };
   };

   async recoveryAccount(email: string) {
      const user = (await this.usersRepository.findByEmail(email)) as any;

      if (!user) {
         throw new HttpException("Usuário não encontrado.", 404);
      }

      const token = genTokenUserRecoveryPassword(user.cod_usuario);
      const url = `https://app.fitcpx.com/recoveryPassword?token=${token}`;
      return this.eventsService.recoveryPasswordUser(user.nome_usuario, email, url);
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

   async updateImageUser(userId: string, fileBuffer: Express.Multer.File) {
      if (!fileBuffer) throw new HttpException("Arquivo não enviado.", 400);

      const key = `${dev ? "developer/" : ""}usuario/perfil/${Date.now()}_${fileBuffer.originalname}`;
      const url = await this.storageService.uploadFile(fileBuffer, key);

      this.usersRepository.updateImageUser(userId, url);
      return url;
   }

   async onError(userId: string, error: string, info: string) {
      return this.usersRepository.onError(userId, error, info);
   }
}
