"use strict";

module.exports = (sequelize, DataTypes) => {
   const tab_aluno_contrato_pagamento = sequelize.define(
      "tab_aluno_contrato_pagamento",
      {
         cod_aluno_contrato_pagamento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
         },
         cod_aluno_contrato: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "tab_aluno_contrato",
               key: "cod_aluno_contrato",
            },
         },
         data_aluno_contrato_pagamento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
         },
         expiracao_aluno_contrato_pagamento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
         },
         repasse_aluno_contrato_pagamento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
         },
         valor_aluno_contrato_pagamento: {
            type: DataTypes.FLOAT(22, 2),
            allowNull: false,
         },
         liquido_aluno_contrato_pagamento: {
            type: DataTypes.FLOAT(22, 2),
            allowNull: false,
         },
         forma_aluno_contrato_pagamento: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         status_aluno_contrato_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         statustexto_aluno_contrato_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         observacao_aluno_contrato_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         id_aluno_contrato_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         ambiente_aluno_contrato_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         json_aluno_contrato_pagamento: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
         },
         jsonwebhook_aluno_contrato_pagamento: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
         },
         asaas_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         asaas_url: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
         },
      },
      {
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   tab_aluno_contrato_pagamento.associate = (models) => {
      tab_aluno_contrato_pagamento.belongsTo(models.tab_aluno_contrato, {
         foreignKey: "cod_aluno_contrato",
         as: "contract",
      });
   };

   return tab_aluno_contrato_pagamento;
};
