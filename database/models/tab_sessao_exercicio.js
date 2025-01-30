module.exports = (sequelize, DataTypes) => {
    const tab_sessao_exercicio = sequelize.define('tab_sessao_exercicio', {
        cod_sessao_exercicio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        cod_sessao: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cod_exercicio: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sequencia_sessao_exercicio: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        serie_sessao_exercicio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        repeticao_sessao_exercicio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        carga_sessao_exercicio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        intervalo_sessao_exercicio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        observacao_sessao_exercicio: {
            type: DataTypes.STRING,
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

    tab_sessao_exercicio.associate = (models) => {
        tab_sessao_exercicio.belongsTo(models.tab_sessao, {
            foreignKey: 'cod_sessao',
            as: 'sessao',
        });

        tab_sessao_exercicio.belongsTo(models.tab_exercicio, {
            foreignKey: 'cod_exercicio',
            as: 'exercicio',
        });
    };

    return tab_sessao_exercicio;
};