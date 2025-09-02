const { tab_empresa } = require("../../database/models");

class companyRepository {
   async findAll() {
      return await tab_empresa.findAll();
   }

   async findById(id) {
      return await tab_empresa.findByPk(id);
   }
}

module.exports = companyRepository;
