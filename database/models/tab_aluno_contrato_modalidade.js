'use strict';

module.exports = (sequelize, DataTypes) => {
  const tab_aluno_contrato_modalidade = sequelize.define('tab_aluno_contrato_modalidade', {
    cod_aluno_contrato_modalidade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cod_aluno_contrato: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tab_aluno_contrato',
        key: 'cod_aluno_contrato'
      }
    },
    cod_modalidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tab_modalidade',
        key: 'cod_modalidade'
      }
    },
    cod_modalidade_variacao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'tab_modalidade_variacao',
        key: 'cod_modalidade_variacao'
      }
    },
    cod_modalidade_variacao_valor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'tab_modalidade_variacao_valor',
        key: 'cod_modalidade_variacao_valor'
      }
    },
    valor_modalidade_alterado: {
      type: DataTypes.FLOAT(22, 2),
      allowNull: true,
      defaultValue: null,
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

  tab_aluno_contrato_modalidade.associate = (models) => {
    tab_aluno_contrato_modalidade.belongsTo(models.tab_modalidade_variacao, {
        foreignKey: 'cod_modalidade_variacao',
        as: 'variacao',
    });
    tab_aluno_contrato_modalidade.belongsTo(models.tab_modalidade_variacao_valor, {
        foreignKey: 'cod_modalidade_variacao_valor',
        as: 'variacaoValor',
    });
    tab_aluno_contrato_modalidade.belongsTo(models.tab_modalidade, {
        foreignKey: 'cod_modalidade',
        as: 'modalidade',
    });
  };

  return tab_aluno_contrato_modalidade;
};