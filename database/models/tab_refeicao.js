'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_refeicao = sequelize.define('tab_refeicao', {
        cod_refeicao: {
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
        cod_cardapio: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'tab_cardapio',
                key: 'cod_cardapio',
            },
        },
        nome_refeicao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sequencia_refeicao: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

    tab_refeicao.associate = (models) => {
        tab_refeicao.belongsTo(models.tab_empresa, {
            foreignKey: 'cod_empresa',
            as: 'empresa',
        });

        tab_refeicao.belongsTo(models.tab_usuario, {
            foreignKey: 'cod_usuario',
            as: 'usuario',
        });

        tab_refeicao.belongsTo(models.tab_cardapio, {
            foreignKey: 'cod_cardapio',
            as: 'cardapio',
        });

        tab_refeicao.hasMany(models.tab_refeicao_alimento, {
            foreignKey: 'cod_refeicao',
            as: 'alimentos',
        });
    };

    return tab_refeicao;
};