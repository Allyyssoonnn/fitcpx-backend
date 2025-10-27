"use strict";
module.exports = (sequelize, DataTypes) => {
   const errors = sequelize.define(
      "errors",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "tab_usuario",
               key: "cod_usuario",
            },
         },
         error: {
            type: DataTypes.TEXT,
            allowNull: true,
         },
         info: {
            type: DataTypes.TEXT,
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
      },
      {
         freezeTableName: true,
         timestamps: true,
      }
   );

   return errors;
};
