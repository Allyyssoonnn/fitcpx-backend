'use strict';

module.exports = (sequelize, DataTypes) => {
  const tab_aluno_sessao_modalidade = sequelize.define('tab_aluno_sessao_modalidade', {
    cod_aluno_sessao_modalidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    cod_aluno_sessao_pacote: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
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
    data_aluno_sessao_modalidade: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null
    },
    status_aluno_sessao_modalidade: {
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

  tab_aluno_sessao_modalidade.associate = models => {
    tab_aluno_sessao_modalidade.belongsTo(models.tab_aluno_sessao_pacote, {
      foreignKey: 'cod_aluno_sessao_pacote',
      as: 'sessaoPacote',
    });
    tab_aluno_sessao_modalidade.belongsTo(models.tab_modalidade, {
      foreignKey: 'cod_modalidade',
      as: 'modalidade',
    });
  };

  return tab_aluno_sessao_modalidade;
};