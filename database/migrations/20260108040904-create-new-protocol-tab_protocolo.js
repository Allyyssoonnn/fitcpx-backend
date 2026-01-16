"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.bulkInsert("tab_protocolo", [
         {
            nome_protocolo: "Jovens - Kach e McArdle (1973)",
            categoria_protocolo: "Geral",
            createdAt: new Date(),
            updatedAt: new Date(),
         },
      ]);
   },

   async down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete("tab_protocolo", {
         nome_protocolo: "Jovens - Kach e McArdle (1973)",
         categoria_protocolo: "Geral",
      });
   },
};
