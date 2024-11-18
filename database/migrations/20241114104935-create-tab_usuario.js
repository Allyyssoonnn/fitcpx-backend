'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_usuario', {
      cod_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      nome_usuario: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      email_usuario: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      senha_usuario: {
        allowNull: false,
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
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('tab_usuario')
  }
};
