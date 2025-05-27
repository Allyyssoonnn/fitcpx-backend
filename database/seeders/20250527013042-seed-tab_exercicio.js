const data = require('../data/tab_exercicio.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_exercicio', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_exercicio', null, {});
  }
};