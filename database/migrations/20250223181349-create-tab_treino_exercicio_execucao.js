'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_treino_exercicio_execucao', {
      cod_treino_exercicio_execucao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_treino_execucao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_treino_execucao',
          key: 'cod_treino_execucao'
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
      treino_exercicio_executado: {
        allowNull: false,
        type: Sequelize.DataTypes.ENUM('S', 'N'),
        defaultValue: 'N',
      },
      sequencia_treino_exercicio_execucao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      serie_treino_exercicio_execucao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      repeticao_treino_exercicio_execucao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      carga_treino_exercicio_execucao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      intervalo_treino_exercicio_execucao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      observacao_treino_exercicio_execucao: {
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
    queryInterface.dropTable('tab_treino_exercicio_execucao')
  }
};