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
         cycle_licenca: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1,
         },
         valor_licenca: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: 0,
         },
         mensal_licenca: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: 0,
         },
         visivel_licenca: {
            type: DataTypes.ENUM("S", "N"),
            allowNull: true,
            defaultValue: "S",
         },
         daysleft_register_licenca: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
         },
         daysleft_activate_licenca: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
         },
         cupom_licenca: {
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
