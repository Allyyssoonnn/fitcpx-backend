"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("errors", {
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
         error: {
            allowNull: true,
            type: Sequelize.DataTypes.TEXT,
            defaultValue: null,
         },
         info: {
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
            defaultValue: null,
         },
      });
   },

   async down(queryInterface, Sequelize) {
      return queryInterface.dropTable("errors");
   },
};
