'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_agenda', {
      cod_agenda: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
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
        references: {
          model: 'tab_aluno',
          key: 'cod_aluno'
        }
      },
      nome_evento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      data_inicio: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      data_fim: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      tipo_evento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      cor_evento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
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
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tab_agenda');
  }
};