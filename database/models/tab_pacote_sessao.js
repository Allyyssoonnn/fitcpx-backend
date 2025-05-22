'use strict';

module.exports = (sequelize, DataTypes) => {
  const tab_pacote_sessao = sequelize.define('tab_pacote_sessao', {
    cod_pacote_sessao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cod_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_pacote_sessao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dias_expiracao_pacote_sessao: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valor_pacote_sessao: {
      type: DataTypes.DOUBLE(22, 2),
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

  tab_pacote_sessao.associate = models => {
    tab_pacote_sessao.belongsTo(models.tab_empresa, {
      foreignKey: 'cod_empresa'
    });
  };

  return tab_pacote_sessao;
};