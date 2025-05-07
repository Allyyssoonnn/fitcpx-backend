'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_modalidade_variacao', {
      cod_modalidade_variacao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_modalidade: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_modalidade',
          key: 'cod_modalidade'
        }
      },
      nome_modalidade_variacao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      valor_modalidade_variacao: {
        type: Sequelize.DataTypes.DOUBLE(22, 2),
        allowNull: true,
        defaultValue: 0
      },
      stripe_product_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      dev_stripe_product_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
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
    queryInterface.dropTable('tab_modalidade_variacao')
  }
};