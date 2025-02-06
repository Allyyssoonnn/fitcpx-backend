module.exports = (sequelize, DataTypes) => {
    const tab_email_envio = sequelize.define('tab_email_envio', {
        cod_email_envio: { type: DataTypes.INTEGER, primaryKey: true },
        email_header: DataTypes.STRING,
        email_body: DataTypes.TEXT,
        email_destino: DataTypes.STRING,
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    }, {
        freezeTableName: true,
    });

    return tab_email_envio;
}