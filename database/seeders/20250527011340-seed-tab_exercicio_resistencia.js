const data = require('../data/tab_exercicio_resistencia.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_exercicio_resistencia', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_exercicio_resistencia', null, {});
  }
};