module.exports = (sequelize, DataTypes) => {
    const tab_tipo_exercicio = sequelize.define('tab_tipo_exercicio', {
        cod_tipo_exercicio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nome_tipo_exercicio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        nome_tipo_exercicio_en: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        nome_tipo_exercicio_es: {
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

    return tab_tipo_exercicio;
};
