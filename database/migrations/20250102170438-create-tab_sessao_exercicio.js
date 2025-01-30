'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_sessao_exercicio', {
      cod_sessao_exercicio: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_sessao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_sessao',
          key: 'cod_sessao'
        }
      },
      cod_exercicio: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_exercicio',
          key: 'cod_exercicio'
        }
      },
      sequencia_sessao_exercicio: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      serie_sessao_exercicio: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      repeticao_sessao_exercicio: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      carga_sessao_exercicio: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      intervalo_sessao_exercicio: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      observacao_sessao_exercicio: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
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
    queryInterface.dropTable('tab_sessao_exercicio')
  }
};