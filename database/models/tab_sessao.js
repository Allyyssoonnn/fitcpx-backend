module.exports = (sequelize, DataTypes) => {
   const Tab_sessao = sequelize.define(
      "tab_sessao",
      {
         cod_sessao: {
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
         cod_treino: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
         },
         nome_sessao: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         sequencia_sessao: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
      },
      {
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   Tab_sessao.associate = (models) => {
      Tab_sessao.belongsTo(models.tab_empresa, {
         foreignKey: "cod_empresa",
         as: "empresa",
      });

      Tab_sessao.belongsTo(models.tab_usuario, {
         foreignKey: "cod_usuario",
         as: "usuario",
      });

      Tab_sessao.belongsTo(models.tab_treino, {
         foreignKey: "cod_treino",
         as: "treino",
      });

      Tab_sessao.hasMany(models.tab_sessao_exercicio, {
         foreignKey: "cod_sessao",
         as: "exercicios",
      });

      Tab_sessao.hasMany(models.tab_treino_execucao, {
         foreignKey: "cod_sessao",
         as: "execucoes",
      });
   };

   return Tab_sessao;
};
