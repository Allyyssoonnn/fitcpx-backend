module.exports = (sequelize, DataTypes) => {
    const tab_exercicio = sequelize.define('tab_exercicio', {
        cod_exercicio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
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
        nome_exercicio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_exercicio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        base_exercicio: {
            type: DataTypes.ENUM('S', 'N'),
            defaultValue: 'N'
        },
        cod_grupo_exercicio_1: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_2: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_3: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_4: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_5: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_6: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_7: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_8: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_9: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_grupo_exercicio_10: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_equipamento_1: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_equipamento_2: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_equipamento_3: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_articulacao_1: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_articulacao_2: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_articulacao_3: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_articulacao_4: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_padrao_movimento: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        cod_tipo_exercicio: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_exercicio_resistencia: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cod_indicacao: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
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

    tab_exercicio.associate = (models) => {
        tab_exercicio.belongsTo(models.tab_empresa, {
            foreignKey: 'cod_empresa',
            as: 'empresa',
        });
        tab_exercicio.belongsTo(models.tab_usuario, {
            foreignKey: 'cod_usuario',
            as: 'usuario',
        });
        // tab_exercicio.belongsTo(models.tab_grupo_exercicio, {
        //     foreignKey: 'cod_grupo_exercicio_1',
        //     as: 'grupo_exercicio_1',
        // });
        // tab_exercicio.belongsTo(models.tab_grupo_exercicio, {
        //     foreignKey: 'cod_grupo_exercicio_2',
        //     as: 'grupo_exercicio_2',
        // });
        // tab_exercicio.belongsTo(models.tab_grupo_exercicio, {
        //     foreignKey: 'cod_grupo_exercicio_3',
        //     as: 'grupo_exercicio_3',
        // });
        // tab_exercicio.belongsTo(models.tab_grupo_exercicio, {
        //     foreignKey: 'cod_grupo_exercicio_4',
        //     as: 'grupo_exercicio_4',
        // });
        // tab_exercicio.belongsTo(models.tab_grupo_exercicio, {
        //     foreignKey: 'cod_grupo_exercicio_5',
        //     as: 'grupo_exercicio_5',
        // });
        // tab_exercicio.belongsTo(models.tab_grupo_exercicio, {
        //     foreignKey: 'cod_grupo_exercicio_6',
        //     as: 'grupo_exercicio_6',
        // });
        // tab_exercicio.belongsTo(models.tab_grupo_exercicio, {
        //     foreignKey: 'cod_grupo_exercicio_7',
        //     as: 'grupo_exercicio_7',
        // });
        // tab_exercicio.belongsTo(models.tab_equipamento, {
        //     foreignKey: 'cod_equipamento_1',
        //     as: 'equipamento_1',
        // });
        // tab_exercicio.belongsTo(models.tab_equipamento, {
        //     foreignKey: 'cod_equipamento_2',
        //     as: 'equipamento_2',
        // });
        // tab_exercicio.belongsTo(models.tab_equipamento, {
        //     foreignKey: 'cod_equipamento_3',
        //     as: 'equipamento_3',
        // });
        // tab_exercicio.belongsTo(models.tab_articulacao, {
        //     foreignKey: 'cod_articulacao_1',
        //     as: 'articulacao_1',
        // });
        // tab_exercicio.belongsTo(models.tab_articulacao, {
        //     foreignKey: 'cod_articulacao_2',
        //     as: 'articulacao_2',
        // });
        // tab_exercicio.belongsTo(models.tab_articulacao, {
        //     foreignKey: 'cod_articulacao_3',
        //     as: 'articulacao_3',
        // });
        // tab_exercicio.belongsTo(models.tab_articulacao, {
        //     foreignKey: 'cod_articulacao_4',
        //     as: 'articulacao_4',
        // });
        // tab_exercicio.belongsTo(models.tab_tipo_exercicio, {
        //     foreignKey: 'cod_tipo_exercicio',
        //     as: 'tipo_exercicio',
        // });
        // tab_exercicio.belongsTo(models.tab_exercicio_resistencia, {
        //     foreignKey: 'cod_exercicio_resistencia',
        //     as: 'exercicio_resistencia',
        // });
        // tab_exercicio.belongsTo(models.tab_indicacao, {
        //     foreignKey: 'cod_indicacao',
        //     as: 'indicacao',
        // });
    };

    return tab_exercicio;
};