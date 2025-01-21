'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tab_usuario', 'admin_usuario', {
      type: Sequelize.ENUM('S', 'N'),
      allowNull: false,
      defaultValue: 'N'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tab_usuario', 'admin_usuario');
  }
};