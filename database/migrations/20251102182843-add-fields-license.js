"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_licenca", "daysleft_register_licenca", {
         type: Sequelize.INTEGER,
         allowNull: true,
         defaultValue: null,
         after: "visivel_licenca",
      });
      await queryInterface.addColumn("tab_licenca", "daysleft_activate_licenca", {
         type: Sequelize.INTEGER,
         allowNull: true,
         defaultValue: null,
         after: "daysleft_register_licenca",
      });
      await queryInterface.addColumn("tab_licenca", "cupom_licenca", {
         type: Sequelize.STRING,
         allowNull: true,
         defaultValue: null,
         after: "daysleft_activate_licenca",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_licenca", "daysleft_licenca");
      await queryInterface.removeColumn("tab_licenca", "daysleft_activate_licenca");
      await queryInterface.removeColumn("tab_licenca", "cupom_licenca");
   },
};
