const data = require('../data/tab_indicacao.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_indicacao', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_indicacao', null, {});
  }
};