'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_pagamento_usuario = sequelize.define('tab_pagamento_usuario', {
        cod_pagamento_usuario: {
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
            allowNull: true,
            references: {
                model: 'tab_usuario',
                key: 'cod_usuario',
            },
            defaultValue: null
        },
        data_pagamento_usuario: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        expiracao_pagamento_usuario: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        valor_pagamento_usuario: {
            type: DataTypes.FLOAT(22, 2),
            allowNull: false,
        },
        liquido_pagamento_usuario: {
            type: DataTypes.FLOAT(22, 2),
            allowNull: false,
        },
        forma_pagamento_usuario: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        parcela_pagamento_usuario: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status_pagamento_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        id_pagamento_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        assinatura_pagamento_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        ambiente_pagamento_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        tipo_pagamento_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        json_pagamento_usuario: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        jsonwebhook_pagamento_usuario: {
            type: DataTypes.TEXT,
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
        timestamps: true,
    });
    
    return tab_pagamento_usuario;
};