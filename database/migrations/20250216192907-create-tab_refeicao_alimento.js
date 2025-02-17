'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_refeicao_alimento', {
      cod_refeicao_alimento: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_refeicao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_refeicao',
          key: 'cod_refeicao'
        }
      },
      cod_alimento: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_alimento',
          key: 'cod_alimento'
        }
      },
      sequencia_refeicao_alimento: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      quantidade_refeicao_alimento: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      horario_refeicao_alimento: {
        allowNull: true,
        type: Sequelize.DataTypes.TIME,
        defaultValue: 'NULL',
      },
      observacao_refeicao_alimento: {
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
    queryInterface.dropTable('tab_refeicao_alimento')
  }
};