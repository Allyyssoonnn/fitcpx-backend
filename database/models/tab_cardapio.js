'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_cardapio = sequelize.define('tab_cardapio', {
        cod_cardapio: {
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
        cod_aluno: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        nome_cardapio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        observacao_cardapio: {
            type: DataTypes.STRING,
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
    
    tab_cardapio.associate = (models) => {
        tab_cardapio.belongsTo(models.tab_empresa, {
            foreignKey: 'cod_empresa',
            as: 'empresa',
        });

        tab_cardapio.belongsTo(models.tab_usuario, {
            foreignKey: 'cod_usuario',
            as: 'usuario',
        });

        tab_cardapio.belongsTo(models.tab_aluno, {
            foreignKey: 'cod_aluno',
            as: 'aluno',
        });

        tab_cardapio.hasMany(models.tab_refeicao, {
            foreignKey: 'cod_cardapio',
            as: 'refeicoes',
        });
    };

    return tab_cardapio;
};
