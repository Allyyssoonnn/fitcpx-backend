const { tab_empresa } = require("../../database/models");

class companyRepository {
   async findAll() {
      return await tab_empresa.findAll();
   }

   async findById(id) {
      return await tab_empresa.findByPk(id);
   }

   async findByEmail(email) {
      return await tab_empresa.findOne({ where: { email_empresa: email.trim() } });
   }

   async create(data) {
      return await tab_empresa.create(data);
   }
}

module.exports = companyRepository;
