"use strict";

module.exports = (sequelize, DataTypes) => {
   const tab_modalidade_variacao = sequelize.define(
      "tab_modalidade_variacao",
      {
         cod_modalidade_variacao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
         },
         cod_modalidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "tab_modalidade",
               key: "cod_modalidade",
            },
         },
         nome_modalidade_variacao: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         valor_modalidade_variacao: {
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

   tab_modalidade_variacao.associate = (models) => {
      tab_modalidade_variacao.hasMany(models.tab_modalidade_variacao_valor, {
         foreignKey: "cod_modalidade_variacao",
         as: "valores",
      });
   };

   return tab_modalidade_variacao;
};
