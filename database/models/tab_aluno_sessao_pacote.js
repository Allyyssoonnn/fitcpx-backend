'use strict';

module.exports = (sequelize, DataTypes) => {
  const tab_aluno_sessao_pacote = sequelize.define('tab_aluno_sessao_pacote', {
    cod_aluno_sessao_pacote: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    cod_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cod_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cod_aluno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_aluno_sessao_pacote: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_aluno_sessao_pacote: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    formapagamento_aluno_sessao_pacote: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    expiracao_aluno_sessao_pacote: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    valor_aluno_sessao_pacote: {
      type: DataTypes.DOUBLE(22, 2),
      allowNull: true,
      defaultValue: null
    },
    ambiente_aluno_sessao_pacote: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dev_stripe_payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    stripe_payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    dev_stripe_refund_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    stripe_refund_id: {
        type: DataTypes.STRING,
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

  tab_aluno_sessao_pacote.associate = models => {
    tab_aluno_sessao_pacote.belongsTo(models.tab_empresa, {
      foreignKey: 'cod_empresa'
    });
    tab_aluno_sessao_pacote.belongsTo(models.tab_usuario, {
      foreignKey: 'cod_usuario'
    });
    tab_aluno_sessao_pacote.belongsTo(models.tab_aluno, {
      foreignKey: 'cod_aluno',
      as: 'aluno'
    });
    tab_aluno_sessao_pacote.hasMany(models.tab_aluno_sessao_modalidade, {
      foreignKey: 'cod_aluno_sessao_pacote',
      as: 'sessoes'
    });
  };

  return tab_aluno_sessao_pacote;
};