'use strict';
module.exports = (sequelize, DataTypes) => {
  const feedbacks = sequelize.define('feedbacks', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tab_empresa',
        key: 'cod_empresa'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
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

  return feedbacks;
};