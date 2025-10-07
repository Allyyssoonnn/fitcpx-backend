"use strict";

module.exports = (sequelize, DataTypes) => {
   const tab_plano = sequelize.define(
      "tab_plano",
      {
         cod_plano: {
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
         nome_plano: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         recorrencia_plano: {
            type: DataTypes.ENUM("S", "N"),
            allowNull: false,
            defaultValue: "N",
         },
         duracao_plano: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         tipo_duracao_plano: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Meses",
         },
         valor_plano: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: null,
         },
         valor_adesao: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: null,
         },
         multa_compensatoria: {
            type: DataTypes.DOUBLE(22, 2),
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
            defaultValue: null,
         },
      },
      {
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   tab_plano.associate = (models) => {
      tab_plano.belongsTo(models.tab_empresa, {
         foreignKey: "cod_empresa",
         as: "empresa",
      });

      tab_plano.hasMany(models.tab_plano_modalidade, {
         foreignKey: "cod_plano",
         as: "modalidades",
      });
   };

   return tab_plano;
};
