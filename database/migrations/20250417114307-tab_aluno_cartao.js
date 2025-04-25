'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_aluno_cartao', {
      cod_aluno_cartao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_aluno: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_aluno',
          key: 'cod_aluno'
        }
      },
      cod_usuario: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_usuario',
          key: 'cod_usuario'
        }
      },
      final_aluno_cartao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      bandeira_aluno_cartao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      token_aluno_cartao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      json_aluno_cartao: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
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
    queryInterface.dropTable('tab_aluno_cartao')
  }
};