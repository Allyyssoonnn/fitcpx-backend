'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_empresa_cartao = sequelize.define('tab_empresa_cartao', {
        cod_empresa_cartao: {
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
        cod_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_usuario',
                key: 'cod_usuario',
            },
        },
        final_empresa_cartao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bandeira_empresa_cartao: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        expiracao_empresa_cartao: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        token_empresa_cartao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        json_empresa_cartao: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        paranoid: true,
        freezeTableName: true,
        timestamps: true,
    });
    
    return tab_empresa_cartao;
};