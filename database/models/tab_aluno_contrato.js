'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_aluno_contrato = sequelize.define('tab_aluno_contrato', {
        cod_aluno_contrato: {
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
        cod_aluno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_aluno',
                key: 'cod_aluno',
            },
        },
        nome_aluno_contrato: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        iniciopagamento_aluno_contrato: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        status_aluno_contrato: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        statustexto_aluno_contrato: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        observacao_aluno_contrato: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        adesao_aluno_contrato: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: null,
        },
        parcela_aluno_contrato: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        total_aluno_contrato: {
            type: DataTypes.DOUBLE(22, 2),
            allowNull: true,
            defaultValue: null,
        },
        expiracao_aluno_contrato: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        modalidades_aluno_contrato: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        arquivo_aluno_contrato: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        id_aluno_contrato: {
            allowNull: true,
            type: DataTypes.STRING,
            defaultValue: null,
        },
        autentique_aluno_contrato: {
            allowNull: true,
            type: DataTypes.STRING,
            defaultValue: null,
        },
        statusautentique_aluno_contrato: {
            allowNull: true,
            type: DataTypes.STRING,
            defaultValue: null,
        },
        ambiente_aluno_contrato: {
            allowNull: true,
            type: DataTypes.STRING,
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

    tab_aluno_contrato.associate = (models) => {
        tab_aluno_contrato.hasMany(models.tab_aluno_contrato_pagamento, {
            foreignKey: 'cod_aluno_contrato',
            as: 'pagamentos',
        })
        tab_aluno_contrato.belongsTo(models.tab_aluno, {
            foreignKey: 'cod_aluno',
            as: 'aluno',
        })
    };

    return tab_aluno_contrato;
};