'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_asaas_webhook = sequelize.define('tab_asaas_webhook', {
        cod_asaas_webhook: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_empresa: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'tab_empresa',
                key: 'cod_empresa',
            },
        },
        json_asaas_webhook: {
            type: DataTypes.TEXT,
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

    return tab_asaas_webhook;
};