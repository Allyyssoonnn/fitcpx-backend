module.exports = (sequelize, DataTypes) => {
    const tab_usuario = sequelize.define('tab_usuario', {
        cod_usuario: { type: DataTypes.INTEGER, primaryKey: true },
        cod_empresa: DataTypes.INTEGER,
        nome_usuario: DataTypes.STRING,
        email_usuario: DataTypes.STRING,
        senha_usuario: DataTypes.STRING,
        telefone_usuario: DataTypes.STRING,
        celular_usuario: DataTypes.STRING,
        cep_usuario: DataTypes.STRING,
        endereco_usuario: DataTypes.STRING,
        numero_usuario: DataTypes.STRING,
        complemento_usuario: DataTypes.STRING,
        bairro_usuario: DataTypes.STRING,
        estado_usuario: DataTypes.STRING,
        cidade_usuario: DataTypes.STRING,
        imagem_usuario: DataTypes.STRING,
        refreshToken: DataTypes.STRING,
    }, {
        freezeTableName: true,
    });

    tab_usuario.associate = (models) => {
        tab_usuario.hasOne(models.tab_empresa, {
            foreignKey: 'cod_empresa',
            as: 'empresa',
        })
    };
  
    return tab_usuario;
}