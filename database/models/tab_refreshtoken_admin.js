'use strict';
module.exports = (sequelize, DataTypes) => {
  const tab_refreshtoken_admin = sequelize.define('tab_refreshtoken_admin', {
    cod_refreshtoken_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    cod_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tab_admin',
        key: 'cod_admin'
      }
    },
    refreshtoken_admin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    useragent_admin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip_admin: {
      type: DataTypes.STRING,
      allowNull: true
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
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
  });

  tab_refreshtoken_admin.associate = function(models) {
    tab_refreshtoken_admin.belongsTo(models.tab_admin, {
      foreignKey: 'cod_admin',
      as: 'admin'
    });
  };

  return tab_refreshtoken_admin;
};