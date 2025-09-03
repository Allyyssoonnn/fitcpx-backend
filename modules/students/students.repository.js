const { Op } = require("sequelize");
const { tab_aluno } = require("../../database/models");

class StudentRepository {
   async findAll(companyId, onlyDeleted = false) {
      const where = onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {};
      if (companyId) where.cod_empresa = companyId;
      return tab_aluno.findAll({
         paranoid: !onlyDeleted,
         where: where,
      });
   }

   async findById(id, companyId) {
      return await tab_aluno.findOne({ where: { cod_aluno: id, cod_empresa: companyId } });
   }
}

module.exports = StudentRepository;
