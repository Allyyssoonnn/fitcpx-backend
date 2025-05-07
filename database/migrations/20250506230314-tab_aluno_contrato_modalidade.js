'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_aluno_contrato_modalidade', {
      cod_aluno_contrato_modalidade: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_aluno_contrato: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_aluno_contrato',
          key: 'cod_aluno_contrato'
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
      cod_modalidade_variacao: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_modalidade_variacao',
          key: 'cod_modalidade_variacao'
        }
      },
      cod_modalidade_variacao_valor: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_modalidade_variacao_valor',
          key: 'cod_modalidade_variacao_valor'
        }
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
    queryInterface.dropTable('tab_aluno_contrato_modalidade')
  }
};