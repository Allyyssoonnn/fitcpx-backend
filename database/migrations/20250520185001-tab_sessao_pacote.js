'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_pacote_sessao', {
      cod_pacote_sessao: {
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
      nome_pacote_sessao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      dias_expiracao_pacote_sessao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      valor_pacote_sessao: {
        allowNull: true,
        type: Sequelize.DataTypes.DOUBLE(22,2),
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
    queryInterface.dropTable('tab_pacote_sessao')
  }
};