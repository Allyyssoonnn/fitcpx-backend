module.exports = (sequelize, DataTypes) => {
    const tab_protocolo = sequelize.define('tab_protocolo', {
        cod_protocolo: { type: DataTypes.INTEGER, primaryKey: true },
        nome_protocolo: DataTypes.STRING,
        categoria_protocolo: DataTypes.STRING,
    }, {
        freezeTableName: true,
    });

    tab_protocolo.associate = (models) => {
        tab_protocolo.belongsTo(models.tab_usuario, { 
            foreignKey: 'cod_usuario', 
            as: 'usuario',
        });
    };
  
    return tab_protocolo;
}