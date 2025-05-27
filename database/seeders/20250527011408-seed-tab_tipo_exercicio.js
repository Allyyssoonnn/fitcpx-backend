const data = require('../data/tab_tipo_exercicio.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_tipo_exercicio', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_tipo_exercicio', null, {});
  }
};