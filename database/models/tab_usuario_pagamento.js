'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_usuario_pagamento = sequelize.define('tab_usuario_pagamento', {
        cod_usuario_pagamento: {
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
        data_usuario_pagamento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        expiracao_usuario_pagamento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        valor_usuario_pagamento: {
            type: DataTypes.FLOAT(22, 2),
            allowNull: false,
        },
        liquido_usuario_pagamento: {
            type: DataTypes.FLOAT(22, 2),
            allowNull: false,
        },
        forma_usuario_pagamento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        parcela_usuario_pagamento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status_usuario_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        id_usuario_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        assinatura_usuario_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        ambiente_usuario_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        tipo_usuario_pagamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        json_usuario_pagamento: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        jsonwebhook_usuario_pagamento: {
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
    
    return tab_usuario_pagamento;
};