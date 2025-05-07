'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_modalidade', {
      cod_modalidade: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_empresa: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_empresa',
          key: 'cod_empresa'
        }
      },
      nome_modalidade: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      descricao_modalidade: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      valor_modalidade: {
        type: Sequelize.DataTypes.DOUBLE(22, 2),
        allowNull: true,
        defaultValue: 0
      },
      variaveis_modalidade: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
        defaultValue: null,
      },
      stripe_product_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      stripe_price_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      dev_stripe_product_id: {
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
    queryInterface.dropTable('tab_modalidade')
  }
};