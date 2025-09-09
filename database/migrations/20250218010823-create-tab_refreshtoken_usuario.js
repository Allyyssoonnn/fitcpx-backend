"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("tab_refreshtoken_usuario", {
         cod_refreshtoken_usuario: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         cod_usuario: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_usuario",
               key: "cod_usuario",
            },
         },
         refreshtoken_usuario: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
         },
         useragent_usuario: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         ip_usuario: {
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
            defaultValue: null,
         },
         expiresAt: {
            allowNull: true,
            type: Sequelize.DataTypes.DATE,
            defaultValue: null,
         },
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("tab_refreshtoken_usuario");
   },
};
