"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_aluno", "status_description", {
         allowNull: true,
         type: Sequelize.DataTypes.STRING,
         after: "status_aluno",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_aluno", "status_description");
   },
};
