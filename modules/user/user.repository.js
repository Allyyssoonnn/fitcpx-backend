const { tab_usuario } = require("../../database/models");

class UserRepository {
   async findAll() {
      return await tab_usuario.findAll();
   }

   async findById(id, companyId) {
      return await tab_usuario.findOne({ where: { id_usuario: id, cod_empresa: companyId } });
   }

   async findByEmail(email) {
      return await tab_usuario.findOne({ where: { email_usuario: email.trim() } });
   }

   async create(data) {
      return await tab_usuario.create(data);
   }
}

module.exports = UserRepository;
