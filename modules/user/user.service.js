const { genTokenUserAuth, validateToken } = require("../../api/utils/token");
const HttpException = require("../../core/http-exception");
const getMessageError = require("../../core/errors-message");
const crypto = require("crypto");
const CompanyRepository = require("../company/company.repository");
const { sendConfirmationCode } = require("../../api/features/n8n");
const dev = (process.env.NODE_ENV || "development") === "development";

class UserService {
   constructor(userRepository) {
      this.userRepository = userRepository;
   }

   getAll = async () => {
      return await this.userRepository.findAll();
   };

   getById = async (id, companyId) => {
      return await this.userRepository.findById(id, companyId);
   };

   create = async (data) => {
      return await this.userRepository.create(data);
   };

   login = async (email, password) => {
      const user = await this.userRepository.findByEmail(email);
      const empresa = await new CompanyRepository().findById(user?.cod_empresa);

      if (!user || user.senha_usuario !== password) {
         throw new HttpException(406, getMessageError("INVALID_CREDENTIALS"));
      }

      const { token, refreshToken } = await genTokenUserAuth(user.cod_usuario, user.cod_empresa);

      const {
         decoded: { status },
      } = validateToken(token);

      const validLicense = status !== "Expired" && status !== "Cancelled" && status !== undefined && status !== null;
      return { token, refreshToken, usuario: user, empresa: empresa, validLicense };
   };

   register = async (name, email, password) => {
      const companyRepository = new CompanyRepository();

      const company = await companyRepository.findByEmail(email);
      const user = await this.userRepository.findByEmail(email);

      if (user || company) {
         throw new HttpException(406, getMessageError("USER_ALREADY_EXISTS"));
      }

      const emailCode = [...crypto.randomFillSync(Buffer.alloc(4))]
         .map((n) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[n % 36])
         .join("");

      if (!dev) sendConfirmationCode(email, name, emailCode);

      const newCompany = await companyRepository.create({
         nome_empresa: name,
         status_empresa: "Active",
         email_empresa: email,
         email_codigo: dev ? "1234" : emailCode,
      });

      const newUser = await this.userRepository.create({
         nome_usuario: name,
         email_usuario: email,
         senha_usuario: password,
         cod_empresa: newCompany.cod_empresa,
         admin_usuario: "S",
      });

      const { token, refreshToken } = await genTokenUserAuth(newUser.cod_usuario, newCompany.cod_empresa);

      const {
         decoded: { status },
      } = validateToken(token);

      const validLicense = status !== "Expired" && status !== "Cancelled" && status !== undefined && status !== null;
      return { token, refreshToken, usuario: newUser, empresa: newCompany, validLicense };
   };
}

module.exports = UserService;
