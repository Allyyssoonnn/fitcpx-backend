"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_empresa", "notifications_config", {
         allowNull: false,
         type: Sequelize.DataTypes.STRING,
         defaultValue: "{}",
         after: "cupom_empresa_licenca",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_empresa", "notifications_config");
   },
};
