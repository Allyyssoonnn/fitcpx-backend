"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_plano", "cod_contrato", {
         type: Sequelize.DataTypes.INTEGER,
         defaultValue: null,
         allowNull: true,
         references: {
            model: "tab_contrato",
            key: "cod_contrato",
         },
         after: "duracao_plano",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_plano", "cod_contrato");
   },
};
