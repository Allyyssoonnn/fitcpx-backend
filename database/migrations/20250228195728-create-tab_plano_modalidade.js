"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("tab_plano_modalidade", {
         cod_plano_modalidade: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         cod_plano: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_plano",
               key: "cod_plano",
            },
         },
         cod_modalidade: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_modalidade",
               key: "cod_modalidade",
            },
         },
         nome_plano_modalidade: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
         },
         cod_modalidade_variacao: {
            allowNull: true,
            defaultValue: null,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_modalidade_variacao",
               key: "cod_modalidade_variacao",
            },
         },
         cod_modalidade_variacao_valor: {
            allowNull: true,
            defaultValue: null,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_modalidade_variacao_valor",
               key: "cod_modalidade_variacao_valor",
            },
         },
         valor_modalidade_alterado: {
            allowNull: true,
            type: Sequelize.DataTypes.FLOAT(22, 2),
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
            defaultValue: null,
         },
      });
   },

   async down(queryInterface, Sequelize) {
      queryInterface.dropTable("tab_plano_modalidade");
   },
};
