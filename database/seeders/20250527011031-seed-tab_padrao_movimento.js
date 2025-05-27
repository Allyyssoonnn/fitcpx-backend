const data = require('../data/tab_padrao_movimento.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_padrao_movimento', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_padrao_movimento', null, {});
  }
};