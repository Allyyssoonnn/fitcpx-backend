module.exports = (sequelize, DataTypes) => {
    const tab_aluno = sequelize.define('tab_aluno', {
        cod_aluno: { type: DataTypes.INTEGER, primaryKey: true },
        nome_aluno: DataTypes.STRING,
        cpf_aluno: DataTypes.STRING,
        rg_aluno: DataTypes.STRING,
        telefone_aluno: DataTypes.STRING,
        email_aluno: DataTypes.STRING,
        data_nascimento_aluno: DataTypes.DATEONLY,
        sexo_aluno: DataTypes.STRING,
        etnia_aluno: DataTypes.STRING,
        cep_aluno: DataTypes.STRING,
        endereco_aluno: DataTypes.STRING,
        numero_aluno: DataTypes.STRING,
        complemento_aluno: DataTypes.STRING,
        bairro_aluno: DataTypes.STRING,
        estado_aluno: DataTypes.STRING,
        cidade_aluno: DataTypes.STRING,
        observacao_aluno: DataTypes.TEXT,
        senha_aluno: DataTypes.STRING,
    }, {
        freezeTableName: true,
    });

    tab_aluno.associate = (models) => {
        tab_aluno.belongsTo(models.tab_usuario, { 
            foreignKey: 'cod_usuario', 
            as: 'usuario',
        });
        tab_aluno.hasMany(models.tab_avaliacao, {
            foreignKey: 'cod_aluno',
            as: 'avaliacao',
        })
    };
  
    return tab_aluno;
}