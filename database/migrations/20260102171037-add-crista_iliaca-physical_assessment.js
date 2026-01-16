"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_avaliacao", "crista_iliaca", {
         allowNull: true,
         type: Sequelize.DataTypes.DECIMAL(5, 2),
         after: "panturrilha",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_avaliacao", "crista_iliaca");
   },
};
