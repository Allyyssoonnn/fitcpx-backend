"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("crm_automations", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         stageId: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "crm_pipeline_stages",
               key: "id",
            },
         },
         name: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         status: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
            defaultValue: "active",
            //active | stopped
         },
         trigger: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         message: {
            allowNull: true,
            type: Sequelize.DataTypes.TEXT,
            defaultValue: null,
         },
         delay: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: 3000,
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
      return queryInterface.dropTable("crm_automations");
   },
};
