"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("crm_pipeline_stages", "sequence", {
         allowNull: true,
         type: Sequelize.DataTypes.INTEGER,
         defaultValue: null,
         after: "pipelineId",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("crm_pipeline_stages", "sequence");
   },
};
