'use strict';

module.exports = (sequelize, DataTypes) => {
  const tab_licenca_variacao = sequelize.define('tab_licenca_variacao', {
    cod_licenca_variacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cod_licenca: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_licenca_variacao: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    valor_licenca_variacao: {
      type: DataTypes.DOUBLE(22, 2),
      allowNull: true,
      defaultValue: 0
    },
    sequencia_licenca_variacao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    stripe_price_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    dev_stripe_price_id: {
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

  tab_licenca_variacao.associate = models => {
    tab_licenca_variacao.belongsTo(models.tab_licenca, {
      foreignKey: 'cod_licenca'
    });
  };

  return tab_licenca_variacao;
};