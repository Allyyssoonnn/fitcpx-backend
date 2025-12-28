"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("wp_messages", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         phone: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
         },
         message: {
            allowNull: true,
            type: Sequelize.DataTypes.TEXT,
            defaultValue: null,
         },
         attach: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         response: {
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
      return queryInterface.dropTable("wp_messages");
   },
};
