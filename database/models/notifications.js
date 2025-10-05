"use strict";
module.exports = (sequelize, DataTypes) => {
   const notifications = sequelize.define(
      "notifications",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         token: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         fcmMessageId: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         event: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         title: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         message: {
            type: DataTypes.TEXT,
            allowNull: false,
         },
         status: {
            type: DataTypes.ENUM("pending", "sent", "failed"),
            allowNull: false,
            defaultValue: "pending",
         },
         errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
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

   return notifications;
};
