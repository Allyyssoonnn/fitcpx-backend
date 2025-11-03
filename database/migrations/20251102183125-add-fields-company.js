"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_empresa", "expiracaocupom_empresa_licenca", {
         type: Sequelize.DATEONLY,
         allowNull: true,
         defaultValue: null,
         after: "presets_treino_inteligente",
      });
      await queryInterface.addColumn("tab_empresa", "cupom_empresa_licenca", {
         type: Sequelize.STRING,
         allowNull: true,
         defaultValue: null,
         after: "expiracaocupom_empresa_licenca",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_empresa", "expiracaocupom_empresa_licenca");
      await queryInterface.removeColumn("tab_empresa", "cupom_empresa_licenca");
   },
};
