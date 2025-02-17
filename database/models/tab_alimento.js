'use strict';

module.exports = (sequelize, DataTypes) => {
    const tab_alimento = sequelize.define('tab_alimento', {
        cod_alimento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_grupo_alimento: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tab_grupo_alimento',
                key: 'cod_grupo_alimento',
            },
        },
        cod_empresa: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        cod_usuario: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        nome_alimento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imagem_alimento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'NULL'
        },
        base_alimento: {
            type: DataTypes.ENUM('S', 'N'),
            defaultValue: 'N'
        },
        umidade: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        energia_kcal: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        energia_kj: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        proteina: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        lipideos: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        colesterol: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        carboidrato: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        fibra_alimentar: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        cinzas: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        calcio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        magnesio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        manganes: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        fosforo: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        ferro: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        sodio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        potassio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        cobre: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        zinco: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        retinol: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        re: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        ra: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        tiamina: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        riboflavina: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        piridoxina: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        niacina: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
        },
        vitamina_c: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '0',
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
    
    tab_alimento.associate = (models) => {
        tab_alimento.belongsTo(models.tab_grupo_alimento, {
            foreignKey: 'cod_grupo_alimento',
            as: 'grupo_alimento',
        });
        tab_alimento.belongsTo(models.tab_empresa, {
            foreignKey: 'cod_empresa',
            as: 'empresa',
        });
        tab_alimento.belongsTo(models.tab_usuario, {
            foreignKey: 'cod_usuario',
            as: 'usuario',
        });
    }

    return tab_alimento;
};