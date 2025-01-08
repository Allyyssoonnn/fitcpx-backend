'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tab_usuario', 'cod_empresa', {
      type: Sequelize.INTEGER,
      references: {
        model: 'tab_empresa',
        key: 'cod_empresa'
      },
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tab_usuario', 'cod_empresa');
  }
};