"use strict";

const { randomUUID } = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("tab_empresa", "token", {
         type: Sequelize.DataTypes.STRING,
         allowNull: true,
         after: "notifications_config",
      });

      const [empresas] = await queryInterface.sequelize.query("SELECT cod_empresa FROM tab_empresa");

      await queryInterface.sequelize.transaction(async (t) => {
         for (const empresa of empresas) {
            await queryInterface.sequelize.query(`UPDATE tab_empresa SET token = :token WHERE cod_empresa = :id`, {
               replacements: { token: randomUUID(), id: empresa.cod_empresa },
               transaction: t,
            });
         }
      });

      await queryInterface.changeColumn("tab_empresa", "token", {
         type: Sequelize.DataTypes.STRING,
         allowNull: false,
      });
   },

   async down(queryInterface, Sequelize) {
      return queryInterface.removeColumn("tab_empresa", "token");
   },
};
