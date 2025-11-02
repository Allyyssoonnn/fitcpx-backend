"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.dropTable("tab_aluno_cartao");
   },

   async down(queryInterface, Sequelize) {},
};
