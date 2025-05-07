'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_plano_modalidade = sequelize.define('tab_plano_modalidade', {
        cod_plano_modalidade: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_plano: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_plano',
                key: 'cod_plano',
            },
        },
        cod_modalidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_modalidade',
                key: 'cod_modalidade',
            },
        },
        cod_modalidade_variacao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_modalidade_variacao',
                key: 'cod_modalidade_variacao',
            },
        },
        cod_modalidade_variacao_valor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_modalidade_variacao_valor',
                key: 'cod_modalidade_variacao_valor',
            },
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
    
    tab_plano_modalidade.associate = (models) => {
        tab_plano_modalidade.belongsTo(models.tab_plano, {
            foreignKey: 'cod_plano',
            as: 'plano',
        });

        tab_plano_modalidade.belongsTo(models.tab_modalidade, {
            foreignKey: 'cod_modalidade',
            as: 'modalidade',
        });
    };

    return tab_plano_modalidade;
};