"use strict";
module.exports = (sequelize, DataTypes) => {
   const wp_messages = sequelize.define(
      "wp_messages",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         phone: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         message: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: null,
         },
         attach: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         response: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
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

   return wp_messages;
};
