module.exports = (sequelize, DataTypes) => {
   const TabTreino = sequelize.define(
      "tab_treino",
      {
         cod_treino: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
         },
         nome_treino: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         desenvolvimento_treino: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         frequencia_treino: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
         },
         cod_empresa: {
            type: DataTypes.INTEGER,
            allowNull: true,
         },
         cod_usuario: {
            type: DataTypes.INTEGER,
            allowNull: true,
         },
         cod_aluno: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
         },
         nivel_treino: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         sexo_treino: {
            type: DataTypes.ENUM("M", "F"),
            allowNull: true,
         },
         observacao_treino: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
         },
         status_treino: {
            type: DataTypes.ENUM("A", "I"),
            allowNull: false,
            defaultValue: "A",
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

   TabTreino.associate = (models) => {
      TabTreino.belongsTo(models.tab_empresa, {
         foreignKey: "cod_empresa",
         as: "empresa",
      });

      TabTreino.belongsTo(models.tab_usuario, {
         foreignKey: "cod_usuario",
         as: "usuario",
      });

      TabTreino.belongsTo(models.tab_aluno, {
         foreignKey: "cod_aluno",
         as: "aluno",
      });

      TabTreino.hasMany(models.tab_sessao, {
         foreignKey: "cod_treino",
         as: "sessoes",
      });
   };

   return TabTreino;
};
