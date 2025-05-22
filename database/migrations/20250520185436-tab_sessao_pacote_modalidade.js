'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_pacote_sessao_modalidade', {
      cod_pacote_sessao_modalidade: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_pacote_sessao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_pacote_sessao',
          key: 'cod_pacote_sessao'
        }
      },
      cod_modalidade: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_modalidade',
          key: 'cod_modalidade'
        }
      },
      valor_modalidade_alterado: {
        allowNull: true,
        type: Sequelize.DataTypes.FLOAT(22, 2),
        defaultValue: null,
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
    queryInterface.dropTable('tab_pacote_sessao_modalidade')
  }
};