'use strict';

module.exports = (sequelize, DataTypes) => {
  const tab_empresa_licenca = sequelize.define('tab_empresa_licenca', {
    cod_empresa_licenca: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cod_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cod_licenca: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cod_licenca_variacao: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expiracao_licenca_variacao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    stripe_subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    stripe_invoice_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    dev_stripe_subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    dev_stripe_invoice_id: {
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

  tab_empresa_licenca.associate = models => {
    tab_empresa_licenca.belongsTo(models.tab_licenca, {
      foreignKey: 'cod_licenca',
      as: 'licenca',
    });

    tab_empresa_licenca.belongsTo(models.tab_licenca_variacao, {
      foreignKey: 'cod_licenca_variacao',
      as: 'licencaVariacao',
    });
  };

  return tab_empresa_licenca;
};