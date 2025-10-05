"use strict";
module.exports = (sequelize, DataTypes) => {
   const mails = sequelize.define(
      "mails",
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
         email: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         subject: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         content: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: null,
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

   return mails;
};
