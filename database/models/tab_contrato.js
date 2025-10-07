"use strict";

module.exports = (sequelize, DataTypes) => {
   const tab_contrato = sequelize.define(
      "tab_contrato",
      {
         cod_contrato: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
         },
         cod_empresa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         nome_contrato: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         contrato: {
            type: DataTypes.TEXT,
            allowNull: false,
         },
         valor_adesao: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: null,
         },
         multa_compensatoria: {
            type: DataTypes.DOUBLE(22, 1),
            allowNull: true,
            defaultValue: null,
         },
         multa_moratoria: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: null,
         },
         juros_atraso: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: null,
         },
         deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
         },
      },
      {
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   return tab_contrato;
};
