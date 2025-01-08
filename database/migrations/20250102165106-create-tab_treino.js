'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_treino', {
      cod_treino: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      nome_treino: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      frequencia_treino: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: null
      },
      cod_empresa: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_empresa',
          key: 'cod_empresa'
        }
      },
      cod_usuario: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_usuario',
          key: 'cod_usuario'
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
      nivel_treino: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      sexo_treino: {
        type: Sequelize.DataTypes.ENUM('M', 'F'),
      },
      observacao_treino: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      base_treino: {
        type: Sequelize.DataTypes.ENUM('S', 'N'),
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
    queryInterface.dropTable('tab_treino')
  }
};