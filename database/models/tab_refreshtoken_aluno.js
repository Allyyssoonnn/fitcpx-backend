"use strict";
module.exports = (sequelize, DataTypes) => {
   const tab_refreshtoken_aluno = sequelize.define(
      "tab_refreshtoken_aluno",
      {
         cod_refreshtoken_aluno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         cod_aluno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "tab_aluno",
               key: "cod_aluno",
            },
         },
         refreshtoken_aluno: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         useragent_aluno: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         ip_aluno: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
         },
         expiresAt: {
            allowNull: true,
            type: DataTypes.DATE,
            defaultValue: null,
         },
      },
      {
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   tab_refreshtoken_aluno.associate = function (models) {
      // Definindo o relacionamento com a tabela 'tab_aluno'
      tab_refreshtoken_aluno.belongsTo(models.tab_aluno, {
         foreignKey: "cod_aluno",
         as: "aluno",
      });
   };

   return tab_refreshtoken_aluno;
};
