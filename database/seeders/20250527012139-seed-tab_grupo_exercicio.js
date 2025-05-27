const data = require('../data/tab_grupo_exercicio.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_grupo_exercicio', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_grupo_exercicio', null, {});
  }
};