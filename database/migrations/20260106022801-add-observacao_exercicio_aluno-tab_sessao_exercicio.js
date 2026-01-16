"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_sessao_exercicio", "observacao_sessao_exercicio_aluno", {
         allowNull: true,
         type: Sequelize.DataTypes.STRING,
         after: "observacao_sessao_exercicio",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("tab_sessao_exercicio", "observacao_sessao_exercicio_aluno");
   },
};
