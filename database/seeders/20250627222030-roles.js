'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'manager', createdAt: new Date(), updatedAt: new Date() },
      { name: 'billing', createdAt: new Date(), updatedAt: new Date() },
      { name: 'member', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {});
  }
};