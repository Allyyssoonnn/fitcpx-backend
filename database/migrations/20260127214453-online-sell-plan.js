"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_plano", "vende_online", {
         type: Sequelize.DataTypes.ENUM("S", "N"),
         defaultValue: "S",
         after: "duracao_plano",
      });
      await queryInterface.addColumn("tab_plano", "vende_recorrencia", {
         type: Sequelize.DataTypes.ENUM("S", "N"),
         defaultValue: "S",
         after: "duracao_plano",
      });
      await queryInterface.addColumn("tab_plano", "maximo_parcelas", {
         type: Sequelize.DataTypes.INTEGER,
         defaultValue: 12,
         after: "duracao_plano",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_plano", "vende_online");
      await queryInterface.removeColumn("tab_plano", "vende_recorrencia");
      await queryInterface.removeColumn("tab_plano", "maximo_parcelas");
   },
};
