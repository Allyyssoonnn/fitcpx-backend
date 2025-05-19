'use strict';

module.exports = (sequelize, DataTypes) => {
  const tab_empresa_licenca_pagamento = sequelize.define('tab_empresa_licenca_pagamento', {
    cod_empresa_licenca_pagamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cod_empresa_licenca: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_empresa_licenca_pagamento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null
    },
    expiracao_empresa_licenca_pagamento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null
    },
    valor_empresa_licenca_pagamento: {
      type: DataTypes.FLOAT(22, 2),
      allowNull: false,
    },
    forma_empresa_licenca_pagamento: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    status_empresa_licenca_pagamento: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    json_empresa_licenca_pagamento: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    ambiente_empresa_licenca_pagamento: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    stripe_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    dev_stripe_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    stripe_refund_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    dev_stripe_refund_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    timestamps: true
  });

  tab_empresa_licenca_pagamento.associate = models => {
    tab_empresa_licenca_pagamento.belongsTo(models.tab_empresa_licenca, {
      foreignKey: 'cod_empresa_licenca',
      as: 'empresaLicenca'
    });
  };

  return tab_empresa_licenca_pagamento;
};