const data = require('../data/tab_articulacao.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_articulacao', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_articulacao', null, {});
  }
};