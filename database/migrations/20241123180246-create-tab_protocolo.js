'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_protocolo', {
      cod_protocolo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_usuario: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_usuario',
          key: 'cod_usuario'
        }
      },
      nome_protocolo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      categoria_protocolo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.bulkInsert('tab_protocolo', [
      { nome_protocolo: '7 a 17 anos - Dezenberg, Weststrate, Seidell - (1991)', categoria_protocolo: 'Geral', createdAt: new Date(), updatedAt: new Date() },
      { nome_protocolo: '18 a 55 anos - Jackson, Pollock e Ward - (1980)', categoria_protocolo: 'Masculino', createdAt: new Date(), updatedAt: new Date() },
      { nome_protocolo: '50 a 75 anos - Rech, Santos e Silva - (2006)', categoria_protocolo: 'Masculino', createdAt: new Date(), updatedAt: new Date() },
      { nome_protocolo: '18 a 61 anos - Jackson e Pollock - (1978)', categoria_protocolo: 'Feminino', createdAt: new Date(), updatedAt: new Date() },
      { nome_protocolo: '60 a 81 anos - Tran e Weltman - (1988)', categoria_protocolo: 'Feminino', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tab_protocolo', null, {});
    await queryInterface.dropTable('tab_protocolo');
  }
};