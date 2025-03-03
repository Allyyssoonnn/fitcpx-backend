'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_mercadopago_webhook = sequelize.define('tab_mercadopago_webhook', {
        cod_mercadopago_webhook: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        data_mercadopago_webhook: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        json_mercadopago_webhook: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        json2_mercadopago_webhook: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    }, {
        paranoid: true,
        freezeTableName: true,
        timestamps: true,
    });
    
    return tab_mercadopago_webhook;
};