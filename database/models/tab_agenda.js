module.exports = (sequelize, DataTypes) => {
    const tab_agenda = sequelize.define('tab_agenda', {
        cod_agenda: { type: DataTypes.INTEGER, primaryKey: true },
        nome_evento: DataTypes.TEXT,
        descricao_evento: DataTypes.TEXT,
        data_inicio: DataTypes.DATE,
        data_fim: DataTypes.DATE,
        tipo_evento: DataTypes.STRING,
        cor_evento: DataTypes.STRING,
        google_id: DataTypes.STRING,
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    }, {
        freezeTableName: true,
    });

    tab_agenda.associate = (models) => {
        tab_agenda.belongsTo(models.tab_usuario, { 
            foreignKey: 'cod_usuario', 
            as: 'usuario',
        });
        tab_agenda.belongsTo(models.tab_aluno, {
            foreignKey: 'cod_aluno',
            as: 'aluno',
        });
        tab_agenda.belongsTo(models.tab_empresa, {
            foreignKey: 'cod_empresa',
            as: 'empresa',
        });
    };
  
    return tab_agenda;
}