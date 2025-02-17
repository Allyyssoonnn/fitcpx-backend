'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_grupo_alimento = sequelize.define('tab_grupo_alimento', {
        cod_grupo_alimento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_empresa: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cod_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nome_grupo_alimento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        base_grupo_alimento: {
            type: DataTypes.ENUM('S', 'N'),
            defaultValue: 'N'
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        paranoid: true,
        freezeTableName: true,
        timestamps: true, // Adicionado para garantir createdAt e updatedAt
    });
    
    return tab_grupo_alimento;
};