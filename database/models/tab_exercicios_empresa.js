"use strict";
module.exports = (sequelize, DataTypes) => {
   const tab_exercicios_empresa = sequelize.define(
      "tab_exercicios_empresa",
      {
         cod_exercicio_empresa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         cod_exercicio: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         cod_empresa: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         url_exercicio_empresa: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
         updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
      },
      {
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   tab_exercicios_empresa.associate = function (models) {
      tab_exercicios_empresa.belongsTo(models.tab_exercicio, {
         foreignKey: "cod_exercicio",
         as: "exercicio",
         onDelete: "CASCADE",
         onUpdate: "CASCADE",
      });
      tab_exercicios_empresa.belongsTo(models.tab_empresa, {
         foreignKey: "cod_empresa",
         as: "empresa",
         onDelete: "CASCADE",
         onUpdate: "CASCADE",
      });
   };

   return tab_exercicios_empresa;
};
