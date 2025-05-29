'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_modalidade_variacao_valor', {
      cod_modalidade_variacao_valor: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_modalidade_variacao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_modalidade_variacao',
          key: 'cod_modalidade_variacao'
        }
      },
      quantidade_modalidade_variacao_valor: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: null,
      },
      nome_modalidade_variacao_valor: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      valor_modalidade_variacao_valor: {
        type: Sequelize.DataTypes.DOUBLE(22, 2),
        allowNull: true,
        defaultValue: 0
      },
      stripe_price_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      dev_stripe_price_id: {
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
    queryInterface.dropTable('tab_modalidade_variacao_valor')
  }
};