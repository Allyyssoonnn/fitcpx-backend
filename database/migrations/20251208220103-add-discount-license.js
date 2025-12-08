"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_licenca", "discount", {
         allowNull: true,
         type: Sequelize.DataTypes.INTEGER,
         defaultValue: null,
         after: "due_licenca",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_licenca", "discount");
   },
};
