'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_treino_execucao', {
      cod_treino_execucao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_treino: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_treino',
          key: 'cod_treino'
        }
      },
      cod_sessao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_sessao',
          key: 'cod_sessao'
        }
      },
      cod_aluno: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: null,
        references: {
          model: 'tab_aluno',
          key: 'cod_aluno'
        }
      },
      duracao_treino_execucao: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: null
      },
      data_treino_execucao: {
        allowNull: true,
        type: Sequelize.DataTypes.DATE,
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
    queryInterface.dropTable('tab_treino_execucao')
  }
};