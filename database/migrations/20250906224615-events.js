"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("events", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         status: {
            type: Sequelize.DataTypes.ENUM("pending", "processed"),
            allowNull: false,
            defaultValue: "pending",
         },
         type: {
            allowNull: true,
            type: Sequelize.DataTypes.ENUM("development", "production"),
            defaultValue: "production",
         },
         json: {
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

      await queryInterface.addIndex("events", ["status", "createdAt"], {
         name: "idx_status_created",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeIndex("events", "idx_status_created");
      return queryInterface.dropTable("events");
   },
};
