module.exports = (sequelize, DataTypes) => {
    const tab_usuario = sequelize.define('tab_usuario', {
        cod_usuario: { type: DataTypes.INTEGER, primaryKey: true },
        nome_usuario: DataTypes.STRING,
        email_usuario: DataTypes.STRING,
        senha_usuario: DataTypes.STRING,
    }, {
        freezeTableName: true,
    });
  
    return tab_usuario;
}