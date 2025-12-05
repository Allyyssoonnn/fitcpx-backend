"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("crm_pipeline_stages", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         pipelineId: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "crm_pipelines",
               key: "id",
            },
         },
         name: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         color: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
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
      return queryInterface.dropTable("crm_pipeline_stages");
   },
};
