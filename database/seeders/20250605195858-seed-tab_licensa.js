const data = require('../data/tab_licenca.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tab_licenca', data);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_licenca', null, {});
  }
};