"use strict";
module.exports = (sequelize, DataTypes) => {
   const device_tokens = sequelize.define(
      "device_tokens",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         companyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         studentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "tab_aluno",
               key: "cod_aluno",
            },
         },
         token: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         platform: {
            type: DataTypes.ENUM("IOS", "Android", "Web"),
            allowNull: true,
         },
         createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
         },
         deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
         },
      },
      {
         freezeTableName: true,
         timestamps: true,
         paranoid: true, // habilita soft delete
      }
   );

   return device_tokens;
};
