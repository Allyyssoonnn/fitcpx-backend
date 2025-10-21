"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("tab_licenca", {
         cod_licenca: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         nome_licenca: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
         },
         descricao_licenca: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         prefix_licenca: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         valor_licenca: {
            type: Sequelize.DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: 0,
         },
         visivel_licenca: {
            type: Sequelize.DataTypes.ENUM("S", "N"),
            allowNull: true,
            defaultValue: "S",
         },
         stripe_product_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         stripe_price_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         dev_stripe_product_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         dev_stripe_price_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
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
      queryInterface.dropTable("tab_licenca");
   },
};
