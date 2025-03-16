'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_empresa_cartao', {
      cod_empresa_cartao: {
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
      cod_usuario: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_usuario',
          key: 'cod_usuario'
        }
      },
      final_empresa_cartao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      bandeira_empresa_cartao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      token_empresa_cartao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      json_empresa_cartao: {
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
    queryInterface.dropTable('tab_empresa_cartao')
  }
};