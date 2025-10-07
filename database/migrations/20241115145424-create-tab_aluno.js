"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("tab_aluno", {
         cod_aluno: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         cod_empresa: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         nome_aluno: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
         },
         status_aluno: {
            type: Sequelize.DataTypes.ENUM("A", "I", "B"),
            defaultValue: "A",
         },
         cpf_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         rg_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         telefone_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         email_aluno: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
         },
         data_nascimento_aluno: {
            type: Sequelize.DataTypes.DATEONLY,
         },
         sexo_aluno: {
            type: Sequelize.DataTypes.ENUM("M", "F"),
         },
         etnia_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         cep_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         endereco_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         numero_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         complemento_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         bairro_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         estado_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         cidade_aluno: {
            type: Sequelize.DataTypes.STRING,
         },
         observacao_aluno: {
            type: Sequelize.DataTypes.TEXT,
         },
         senha_aluno: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
         },
         imagem_aluno: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         cod_usuario: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_usuario",
               key: "cod_usuario",
            },
         },
         dev_stripe_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         stripe_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         asaas_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         payment_stripe_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         dev_payment_stripe_id: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DataTypes.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DataTypes.DATE,
         },
         deletedAt: {
            allowNull: true,
            type: Sequelize.DataTypes.DATE,
            defaultValue: null,
         },
      });
   },

   async down(queryInterface, Sequelize) {
      queryInterface.dropTable("tab_aluno");
   },
};
