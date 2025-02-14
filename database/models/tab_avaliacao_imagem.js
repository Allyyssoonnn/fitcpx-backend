module.exports = (sequelize, DataTypes) => {
    const tab_avaliacao_imagem = sequelize.define('tab_avaliacao_imagem', {
        cod_avaliacao_imagem: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Adicionado para auto incremento
      },
      descricao_imagem: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url_imagem: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tamanho_imagem: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
      paranoid: true,
      freezeTableName: true,
      timestamps: true,  // Adicionado para garantir que o Sequelize use createdAt e updatedAt
    });
      
    return tab_avaliacao_imagem;
};