module.exports = (sequelize, DataTypes) => {
    const tab_empresa = sequelize.define('tab_empresa', {
        cod_empresa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nome_empresa: DataTypes.STRING,
        descricao_empresa: DataTypes.STRING,
        razao_social_empresa: DataTypes.STRING,
        doc_empresa: DataTypes.STRING,
        pix_empresa: DataTypes.STRING,
        email_empresa: DataTypes.STRING,
        email_confirmado: DataTypes.ENUM("S", "N"),
        email_codigo: DataTypes.STRING,
        telefone_empresa: DataTypes.STRING,
        cep_empresa: DataTypes.STRING,
        endereco_empresa: DataTypes.STRING,
        numero_empresa: DataTypes.STRING,
        complemento_empresa: DataTypes.STRING,
        bairro_empresa: DataTypes.STRING,
        estado_empresa: DataTypes.STRING,
        cidade_empresa: DataTypes.STRING,
        imagem_empresa: DataTypes.STRING,
        walletid_empresa: DataTypes.STRING,
        asaas_id: DataTypes.STRING,
        asaas_apikey: DataTypes.STRING,
        dev_walletid_empresa: DataTypes.STRING,
        dev_asaas_id: DataTypes.STRING,
        dev_asaas_apikey: DataTypes.STRING,
        presets_treino_inteligente: DataTypes.TEXT,
    }, {
        freezeTableName: true,
    });
  
    return tab_empresa;
}