"use strict";
module.exports = (sequelize, DataTypes) => {
   const checkout_sessions = sequelize.define(
      "checkout_sessions",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         studentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
               model: "tab_aluno",
               key: "cod_aluno",
            },
         },
         userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
               model: "tab_usuario",
               key: "cod_usuario",
            },
         },
         companyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         planId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
               model: "tab_plano",
               key: "cod_plano",
            },
         },
         token: {
            type: DataTypes.STRING,
            allowNull: false,
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

   checkout_sessions.associate = (models) => {
      checkout_sessions.belongsTo(models.tab_usuario, {
         foreignKey: "userId",
         as: "user",
      });
      checkout_sessions.belongsTo(models.tab_empresa, {
         foreignKey: "companyId",
         as: "company",
      });
      checkout_sessions.belongsTo(models.tab_aluno, {
         foreignKey: "studentId",
         as: "student",
      });
   };

   return checkout_sessions;
};
