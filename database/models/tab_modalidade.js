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

        tab_modalidade.hasMany(models.tab_plano_modalidade, {
            foreignKey: 'cod_modalidade',
            as: 'planos',
        });
    };

    return tab_modalidade;
};