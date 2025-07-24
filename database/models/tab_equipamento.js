module.exports = (sequelize, DataTypes) => {
    const tab_equipamento = sequelize.define('tab_equipamento', {
        cod_equipamento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nome_equipamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        nome_equipamento_en: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        nome_equipamento_es: {
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

    return tab_equipamento;
};
