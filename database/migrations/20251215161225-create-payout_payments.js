"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("payout_payments", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         payoutId: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "payouts",
               key: "id",
            },
         },
         contractPaymentId: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_aluno_contrato_pagamento",
               key: "cod_aluno_contrato_pagamento",
            },
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DataTypes.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DataTypes.DATE,
         },
         deletedAt: {
            allowNull: true,
            type: Sequelize.DataTypes.DATE,
            defaultValue: null,
         },
      });
   },

   async down(queryInterface, Sequelize) {
      return queryInterface.dropTable("payout_payments");
   },
};
