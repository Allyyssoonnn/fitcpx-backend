module.exports = (sequelize, DataTypes) => {
    const tab_avaliacao = sequelize.define('tab_avaliacao', {
      cod_avaliacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Adicionado para auto incremento
      },
      data_avaliacao: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      peso: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      altura: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      metabolismo_basal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gordura_viceral: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cod_protocolo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      metodo_dobras: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      triciptal: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      peitoral: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      subescapular: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      axilar_media: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      abdominal: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      coxa: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      supra_iliaca: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      supra_espinhal: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      biciptal: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      panturrilha: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      pescoco: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      ombro: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      torax_inspirado: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      torax_expirado: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      punho: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      cintura: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      abdomen: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      quadril: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      braco_relaxado_direito: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      braco_contraido_direito: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      antebraco_direito: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      coxa_direita: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      panturrilha_direita: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      braco_relaxado_esquerdo: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      braco_contraido_esquerdo: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      antebraco_esquerdo: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      coxa_esquerda: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      panturrilha_esquerda: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      biestiloide_punho: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      biepicondilo_umeral: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      biepicondilo_femoral: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
    }, {
      freezeTableName: true,
      timestamps: true,  // Adicionado para garantir que o Sequelize use createdAt e updatedAt
    });

    tab_avaliacao.associate = (models) => {
      tab_avaliacao.belongsTo(models.tab_aluno, { 
          foreignKey: 'cod_aluno', 
          as: 'aluno',
      });
      tab_avaliacao.belongsTo(models.tab_protocolo, { 
        foreignKey: 'cod_protocolo', 
        as: 'protocolo',
    });
    };
  
    return tab_avaliacao;
};