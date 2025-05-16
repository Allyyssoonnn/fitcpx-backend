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
    status_empresa_licenca: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    forma_empresa_licenca: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    ambiente_empresa_licenca: {
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
    tab_empresa_licenca.hasMany(models.tab_empresa_licenca_pagamento, {
      foreignKey: 'cod_empresa_licenca',
      as: 'payments',
    });

    tab_empresa_licenca.belongsTo(models.tab_licenca, {
      foreignKey: 'cod_licenca',
      as: 'licenca'
    });
  };

  return tab_empresa_licenca;
};