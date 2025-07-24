module.exports = (sequelize, DataTypes) => {
    const tab_articulacao = sequelize.define('tab_articulacao', {
        cod_articulacao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nome_articulacao: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        nome_articulacao_en: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        nome_articulacao_es: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    }, {
        paranoid: true,
        freezeTableName: true,
        timestamps: true,
    });

    return tab_articulacao;
};
