"use strict";

module.exports = (sequelize, DataTypes) => {
   const tab_modalidade_variacao_valor = sequelize.define(
      "tab_modalidade_variacao_valor",
      {
         cod_modalidade_variacao_valor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
         },
         cod_modalidade_variacao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "tab_modalidade_variacao",
               key: "cod_modalidade_variacao",
            },
         },
         quantidade_modalidade_variacao_valor: {
            type: DataTypes.INTEGER,
            allowNull: true,
         },
         nome_modalidade_variacao_valor: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         valor_modalidade_variacao_valor: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: 0,
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

   return tab_modalidade_variacao_valor;
};
