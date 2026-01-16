"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      return queryInterface.bulkUpdate(
         "tab_protocolo",
         {
            nome_protocolo: "Marinha Americana (U.S. Navy)",
         },
         { cod_protocolo: 6 }
      );
   },

   async down(queryInterface, Sequelize) {
      return queryInterface.bulkUpdate(
         "tab_protocolo",
         {
            nome_protocolo: "Jovens - Kach e McArdle (1973)",
         },
         { cod_protocolo: 6 }
      );
   },
};
