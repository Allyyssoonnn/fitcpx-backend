'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_google_token = sequelize.define('tab_google_token', {
        cod_google_token: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_empresa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_empresa',
                key: 'cod_empresa',
            },
        },
        email_google: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        google_token: {
            type: DataTypes.TEXT, // Usando TEXT para armazenar tokens longos
            allowNull: false,
        },
        google_refresh_token: {
            type: DataTypes.TEXT, // Usando TEXT para armazenar tokens longos
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true, // Campo para armazenar a data de expiração do token
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        paranoid: true,
        freezeTableName: true,
        timestamps: true, // Garantindo createdAt e updatedAt
    });
    
    return tab_google_token;
};