"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.dropTable("tab_pacote_sessao_modalidade");
      await queryInterface.dropTable("tab_pacote_sessao");
      await queryInterface.dropTable("tab_aluno_sessao_modalidade");
      await queryInterface.dropTable("tab_aluno_sessao_pacote");
      await queryInterface.dropTable("tab_refeicao_alimento");
      await queryInterface.dropTable("tab_refeicao");
      await queryInterface.dropTable("tab_cardapio_alimento");
      await queryInterface.dropTable("tab_cardapio");
      await queryInterface.dropTable("tab_alimento");
      await queryInterface.dropTable("tab_grupo_alimento");
      await queryInterface.dropTable("tab_google_token");
      await queryInterface.dropTable("tab_refreshtoken_admin");
      await queryInterface.dropTable("tab_admin");
   },

   async down(queryInterface, Sequelize) {},
};
