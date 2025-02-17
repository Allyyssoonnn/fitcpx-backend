'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_refeicao_alimento = sequelize.define('tab_refeicao_alimento', {
        cod_refeicao_alimento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_refeicao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_refeicao',
                key: 'cod_refeicao',
            },
        },
        cod_alimento: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_alimento',
                key: 'cod_alimento',
            },
        },
        sequencia_refeicao_alimento: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantidade_refeicao_alimento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        horario_refeicao_alimento: {
            type: DataTypes.TIME,
            allowNull: true,
            defaultValue: 'NULL',
        },
        observacao_refeicao_alimento: {
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
  
    tab_refeicao_alimento.associate = (models) => {
        tab_refeicao_alimento.belongsTo(models.tab_refeicao, {
            foreignKey: 'cod_refeicao',
            as: 'refeicao',
        });

        tab_refeicao_alimento.belongsTo(models.tab_alimento, {
            foreignKey: 'cod_alimento',
            as: 'alimento',
        });
    };

    return tab_refeicao_alimento;
};