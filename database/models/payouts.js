"use strict";
module.exports = (sequelize, DataTypes) => {
   const payouts = sequelize.define(
      "payouts",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         companyId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         date: {
            allowNull: false,
            type: DataTypes.DATE,
         },
         value: {
            allowNull: false,
            type: DataTypes.FLOAT(22, 2),
         },
         proofURL: {
            allowNull: true,
            type: DataTypes.STRING,
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

   payouts.associate = (models) => {
      payouts.hasMany(models.payout_payments, {
         foreignKey: "payoutId",
         as: "payments",
      });
   };

   return payouts;
};
