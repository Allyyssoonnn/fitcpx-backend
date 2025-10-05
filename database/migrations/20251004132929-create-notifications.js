"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("notifications", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         token: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
         },
         fcmMessageId: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
         },
         event: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
         },
         title: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
         },
         message: {
            allowNull: false,
            type: Sequelize.DataTypes.TEXT,
         },
         status: {
            allowNull: false,
            type: Sequelize.DataTypes.ENUM("pending", "sent", "failed"),
            defaultValue: "pending",
         },
         errorMessage: {
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
      return queryInterface.dropTable("notifications");
   },
};
