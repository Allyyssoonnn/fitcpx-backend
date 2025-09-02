const { genTokenUserAuth, validateToken } = require("../../api/utils/token");
const HttpException = require("../../core/http-exception");
const getMessageError = require("../../core/errors-message");

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

      if (!user || user.senha_usuario !== password) {
         throw new HttpException(406, getMessageError("INVALID_CREDENTIALS"));
      }

      const { token, refreshToken } = await genTokenUserAuth(user.cod_usuario, user.cod_empresa);

      const {
         decoded: { status },
      } = validateToken(token);

      const validLicense = status !== "Expired" && status !== "Cancelled" && status !== undefined && status !== null;
      return { token, refreshToken, usuario: user, empresa: user.cod_empresa, validLicense };
   };
}

module.exports = UserService;
