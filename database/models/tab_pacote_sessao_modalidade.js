'use strict';

module.exports = (sequelize, DataTypes) => {
  const tab_pacote_sessao_modalidade = sequelize.define('tab_pacote_sessao_modalidade', {
    cod_pacote_sessao_modalidade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cod_pacote_sessao: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cod_modalidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valor_modalidade_alterado: {
      type: DataTypes.FLOAT(22, 2),
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

  tab_pacote_sessao_modalidade.associate = models => {
    tab_pacote_sessao_modalidade.belongsTo(models.tab_pacote_sessao, {
      foreignKey: 'cod_pacote_sessao'
    });
    tab_pacote_sessao_modalidade.belongsTo(models.tab_modalidade, {
      foreignKey: 'cod_modalidade'
    });
  };

  return tab_pacote_sessao_modalidade;
};