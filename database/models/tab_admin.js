'use strict';
module.exports = (sequelize, DataTypes) => {
  const tab_admin = sequelize.define('tab_admin', {
    cod_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nome_admin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_admin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha_admin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
  });

  return tab_admin;
};