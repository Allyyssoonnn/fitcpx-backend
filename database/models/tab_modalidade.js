'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_modalidade = sequelize.define('tab_modalidade', {
        cod_modalidade: {
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
        nome_modalidade: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao_modalidade: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        valor_modalidade: {
            type: DataTypes.DOUBLE(22,2),
            allowNull: true,
            defaultValue: 0,
        },
        variaveis_modalidade: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        stripe_product_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        stripe_price_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        dev_stripe_product_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        dev_stripe_price_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
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
    
    tab_modalidade.associate = (models) => {
        tab_modalidade.belongsTo(models.tab_empresa, {
            foreignKey: 'cod_empresa',
            as: 'empresa',
        });
        
        tab_modalidade.hasMany(models.tab_modalidade_variacao, {
            foreignKey: 'cod_modalidade',
            as: 'variacoes',
        });
    };

    return tab_modalidade;
};