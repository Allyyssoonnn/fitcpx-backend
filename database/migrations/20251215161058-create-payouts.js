"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("payouts", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         companyId: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         date: {
            allowNull: false,
            type: Sequelize.DataTypes.DATE,
         },
         value: {
            allowNull: false,
            type: Sequelize.DataTypes.FLOAT(22, 2),
         },
         proofURL: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
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

      await queryInterface.addIndex("payouts", ["companyId", "date"], {
         name: "idx_companyId_date",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeIndex("payouts", "idx_companyId_date");
      return queryInterface.dropTable("payouts");
   },
};
