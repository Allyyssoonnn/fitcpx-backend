"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.dropTable("crm_pipeline_stages");
      await queryInterface.dropTable("crm_pipelines");
      await queryInterface.dropTable("crm_automations");
      await queryInterface.dropTable("wp_messages");
   },

   async down(queryInterface, Sequelize) {},
};
