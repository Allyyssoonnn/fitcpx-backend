'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_asaas_webhook', {
      cod_asaas_webhook: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_empresa: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_empresa',
          key: 'cod_empresa'
        }
      },
      json_asaas_webhook: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DataTypes.DATE,
        defaultValue: null
      },
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('tab_asaas_webhook')
  }
};