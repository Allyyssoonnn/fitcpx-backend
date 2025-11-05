"use strict";
module.exports = (sequelize, DataTypes) => {
   const chat = sequelize.define(
      "chat",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         companyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "tab_usuario",
               key: "cod_usuario",
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
         from: {
            type: DataTypes.ENUM("student", "company"),
            allowNull: false,
            defaultValue: "student",
         },
         status: {
            type: DataTypes.ENUM("read", "unread"),
            allowNull: false,
            defaultValue: "unread",
         },
         message: {
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

   chat.associate = (models) => {
      chat.belongsTo(models.tab_aluno, {
         foreignKey: "studentId",
         as: "student",
      });
      chat.belongsTo(models.tab_usuario, {
         foreignKey: "userId",
         as: "user",
      });
      chat.belongsTo(models.tab_empresa, {
         foreignKey: "companyId",
         as: "company",
      });
   };

   return chat;
};
