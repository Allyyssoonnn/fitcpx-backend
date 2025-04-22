'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_treino_execucao = sequelize.define('tab_treino_execucao', {
        cod_treino_execucao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_treino: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_treino',
                key: 'cod_treino',
            },
        },
        cod_sessao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_sessao',
                key: 'cod_sessao',
            },
        },
        cod_aluno: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'tab_aluno',
                key: 'cod_aluno',
            },
        },
        duracao_treino_execucao: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        data_treino_execucao: {
            type: DataTypes.DATE,
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
        timestamps: true, // Adicionado para garantir createdAt e updatedAt
    });

    tab_treino_execucao.associate = (models) => {
        tab_treino_execucao.hasMany(models.tab_treino_execucao_exercicio, {
            foreignKey: 'cod_treino_execucao',
            as: 'exercicios',
        });
    };
    
    return tab_treino_execucao;
};