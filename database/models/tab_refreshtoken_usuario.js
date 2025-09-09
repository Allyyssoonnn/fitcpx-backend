"use strict";
module.exports = (sequelize, DataTypes) => {
   const tab_refreshtoken_usuario = sequelize.define(
      "tab_refreshtoken_usuario",
      {
         cod_refreshtoken_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         cod_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "tab_usuario",
               key: "cod_usuario",
            },
         },
         refreshtoken_usuario: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         useragent_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         ip_usuario: {
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

   tab_refreshtoken_usuario.associate = function (models) {
      tab_refreshtoken_usuario.belongsTo(models.tab_usuario, {
         foreignKey: "cod_usuario",
         as: "usuario",
      });
   };

   return tab_refreshtoken_usuario;
};
