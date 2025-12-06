"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_empresa", "feedback", {
         allowNull: true,
         type: Sequelize.DataTypes.STRING,
         defaultValue: null,
         after: "crmStepId",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_empresa", "feedback");
   },
};
