module.exports = (sequelize, DataTypes) => {
   const tab_usuario = sequelize.define(
      "tab_usuario",
      {
         cod_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
         cod_empresa: DataTypes.INTEGER,
         nome_usuario: DataTypes.STRING,
         email_usuario: DataTypes.STRING,
         senha_usuario: DataTypes.STRING,
         telefone_usuario: DataTypes.STRING,
         celular_usuario: DataTypes.STRING,
         cpf_usuario: DataTypes.STRING,
         data_nascimento_usuario: DataTypes.DATEONLY,
         cep_usuario: DataTypes.STRING,
         endereco_usuario: DataTypes.STRING,
         numero_usuario: DataTypes.STRING,
         complemento_usuario: DataTypes.STRING,
         bairro_usuario: DataTypes.STRING,
         estado_usuario: DataTypes.STRING,
         cidade_usuario: DataTypes.STRING,
         imagem_usuario: DataTypes.STRING,
         refreshToken: DataTypes.STRING,
         stripe_id: DataTypes.STRING,
         dev_stripe_id: DataTypes.STRING,
         stripe_account_id: DataTypes.STRING,
         dev_stripe_account_id: DataTypes.STRING,
         front_doc_id: DataTypes.STRING,
         back_doc_id: DataTypes.STRING,
         titular_banco_conta: DataTypes.STRING,
         codigo_banco_conta: DataTypes.STRING,
         agencia_banco_conta: DataTypes.STRING,
         numero_banco_conta: DataTypes.STRING,
         admin_usuario: DataTypes.ENUM("S", "N"),
         deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
         },
      },
      {
         freezeTableName: true,
      }
   );

   tab_usuario.associate = (models) => {
      tab_usuario.belongsTo(models.tab_empresa, {
         foreignKey: "cod_empresa",
         as: "empresa",
      });
   };

   return tab_usuario;
};
