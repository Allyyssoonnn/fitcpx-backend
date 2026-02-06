"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("checkout_sessions", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         userId: {
            allowNull: true,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_usuario",
               key: "cod_usuario",
            },
         },
         studentId: {
            allowNull: true,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_aluno",
               key: "cod_aluno",
            },
         },
         companyId: {
            allowNull: true,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         planId: {
            allowNull: true,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_plano",
               key: "cod_plano",
            },
         },
         token: {
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
         deletedAt: {
            allowNull: true,
            type: Sequelize.DataTypes.DATE,
            defaultValue: null,
         },
      });

      await queryInterface.addIndex("checkout_sessions", ["token"], {
         name: "idx_token",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeIndex("checkout_sessions", "idx_token");
      return queryInterface.dropTable("checkout_sessions");
   },
};
