'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_avaliacao_imagem', {
      cod_avaliacao_imagem: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_avaliacao: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_avaliacao',
          key: 'cod_avaliacao'
        }
      },
      descricao_imagem: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      url_imagem: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      tamanho_imagem: {
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
    await queryInterface.dropTable('tab_avaliacao_imagem');
  }
};