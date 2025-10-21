"use strict";

module.exports = (sequelize, DataTypes) => {
   const tab_licenca = sequelize.define(
      "tab_licenca",
      {
         cod_licenca: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
         },
         nome_licenca: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         descricao_licenca: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         prefix_licenca: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         valor_licenca: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: 0,
         },
         stripe_product_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         stripe_price_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         dev_stripe_product_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         dev_stripe_price_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
         },
      },
      {
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   return tab_licenca;
};
