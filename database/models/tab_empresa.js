module.exports = (sequelize, DataTypes) => {
   const tab_empresa = sequelize.define(
      "tab_empresa",
      {
         cod_empresa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
         nome_empresa: DataTypes.STRING,
         status_empresa: DataTypes.STRING,
         descricao_empresa: DataTypes.STRING,
         razao_social_empresa: DataTypes.STRING,
         doc_empresa: DataTypes.STRING,
         pix_empresa: DataTypes.STRING,
         email_empresa: DataTypes.STRING,
         email_confirmado: DataTypes.ENUM("S", "N"),
         email_codigo: DataTypes.STRING,
         telefone_empresa: DataTypes.STRING,
         celular_empresa: DataTypes.STRING,
         cep_empresa: DataTypes.STRING,
         endereco_empresa: DataTypes.STRING,
         numero_empresa: DataTypes.STRING,
         complemento_empresa: DataTypes.STRING,
         bairro_empresa: DataTypes.STRING,
         estado_empresa: DataTypes.STRING,
         cidade_empresa: DataTypes.STRING,
         imagem_empresa: DataTypes.STRING,
         walletid_empresa: DataTypes.STRING,
         asaas_apikey: DataTypes.STRING,
         asaas_id: DataTypes.STRING,
         crm_id: DataTypes.STRING,
         crmStepId: DataTypes.STRING,
         feedback: DataTypes.STRING,
         dev_walletid_empresa: DataTypes.STRING,
         dev_asaas_apikey: DataTypes.STRING,
         titular_banco_conta: DataTypes.STRING,
         codigo_banco_conta: DataTypes.STRING,
         agencia_banco_conta: DataTypes.STRING,
         numero_banco_conta: DataTypes.STRING,
         presets_treino_inteligente: DataTypes.TEXT,
         cupom_empresa_licenca: DataTypes.STRING,
         notifications_config: DataTypes.STRING,
         token: DataTypes.STRING,
         expiracaocupom_empresa_licenca: DataTypes.DATEONLY,
      },
      {
         freezeTableName: true,
      },
   );

   tab_empresa.associate = (models) => {
      tab_empresa.hasMany(models.tab_empresa_licenca, {
         foreignKey: "cod_empresa",
         as: "licenses",
      });
   };

   return tab_empresa;
};
