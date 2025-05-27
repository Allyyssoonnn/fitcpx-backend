const data = require('../data/tab_equipamento.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_equipamento', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_equipamento', null, {});
  }
};