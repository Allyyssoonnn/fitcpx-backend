'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_plano', {
      cod_plano: {
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
      nome_plano: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      duracao_plano: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      tipo_duracao_plano: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      valor_plano: {
        allowNull: true,
        type: Sequelize.DataTypes.DOUBLE(22,2),
        defaultValue: null
      },
      valor_adesao: {
        allowNull: true,
        type: Sequelize.DataTypes.DOUBLE(22,2),
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
    queryInterface.dropTable('tab_plano')
  }
};