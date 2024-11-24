module.exports = (sequelize, DataTypes) => {
    const tab_agenda = sequelize.define('tab_agenda', {
        cod_agenda: { type: DataTypes.INTEGER, primaryKey: true },
        nome_evento: DataTypes.STRING,
        data_inicio: DataTypes.DATE,
        data_fim: DataTypes.DATE,
        tipo_evento: DataTypes.STRING,
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
        })
    };
  
    return tab_agenda;
}