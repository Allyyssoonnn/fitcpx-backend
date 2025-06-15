'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_aluno_cartao = sequelize.define('tab_aluno_cartao', {
        cod_aluno_cartao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_aluno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_aluno',
                key: 'cod_aluno',
            },
        },
        cod_usuario: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'tab_usuario',
                key: 'cod_usuario',
            },
        },
        final_aluno_cartao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bandeira_aluno_cartao: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        expiracao_aluno_cartao: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        token_aluno_cartao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        json_aluno_cartao: {
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

    return tab_aluno_cartao;
};