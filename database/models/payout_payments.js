"use strict";
module.exports = (sequelize, DataTypes) => {
   const payout_payments = sequelize.define(
      "payout_payments",
      {
         id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
         },
         payoutId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
               model: "payouts",
               key: "id",
            },
         },
         contractPaymentId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
               model: "tab_aluno_contrato_pagamento",
               key: "cod_aluno_contrato_pagamento",
            },
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

   payout_payments.associate = (models) => {
      payout_payments.belongsTo(models.payouts, {
         foreignKey: "payoutId",
         as: "payout",
      });
   };

   return payout_payments;
};
