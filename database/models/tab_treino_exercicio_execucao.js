'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_treino_exercicio_execucao = sequelize.define('tab_treino_exercicio_execucao', {
        cod_treino_exercicio_execucao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_treino_execucao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_treino_execucao',
                key: 'cod_treino_execucao',
            },
        },
        cod_exercicio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_exercicio',
                key: 'cod_exercicio',
            },
        },
        treino_exercicio_executado: {
            type: DataTypes.ENUM('S', 'N'),
            allowNull: false,
            defaultValue: 'N',
        },
        sequencia_treino_exercicio_execucao: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        serie_treino_exercicio_execucao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        repeticao_treino_exercicio_execucao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        carga_treino_exercicio_execucao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        intervalo_treino_exercicio_execucao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        observacao_treino_exercicio_execucao: {
            type: DataTypes.STRING,
            allowNull: true,
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
    
    return tab_treino_exercicio_execucao;
};