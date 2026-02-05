"use strict";
module.exports = (sequelize, DataTypes) => {
   const student_attachments = sequelize.define(
      "student_attachments",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "tab_aluno",
               key: "cod_aluno",
            },
         },
         name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         type: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         url: {
            type: DataTypes.STRING,
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
         paranoid: true,
      },
   );

   return student_attachments;
};
