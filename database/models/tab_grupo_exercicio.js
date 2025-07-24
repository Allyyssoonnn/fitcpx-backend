module.exports = (sequelize, DataTypes) => {
    const Tab_grupo_exercicio = sequelize.define('tab_grupo_exercicio', {
        cod_grupo_exercicio: {
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
        nome_grupo_exercicio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nome_grupo_exercicio_en: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nome_grupo_exercicio_es: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        base_grupo_exercicio: {
            type: DataTypes.ENUM('S', 'N'),
            defaultValue: 'N'
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

    Tab_grupo_exercicio.associate = (models) => {
        Tab_grupo_exercicio.belongsTo(models.tab_empresa, {
            foreignKey: 'cod_empresa',
            as: 'empresa',
        });

        Tab_grupo_exercicio.belongsTo(models.tab_usuario, {
            foreignKey: 'cod_usuario',
            as: 'usuario',
        });
    };

    return Tab_grupo_exercicio;
};