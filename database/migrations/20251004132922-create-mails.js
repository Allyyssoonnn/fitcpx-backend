"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("mails", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         companyId: {
            allowNull: true,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         studentId: {
            allowNull: true,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_aluno",
               key: "cod_aluno",
            },
         },
         email: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
         },
         subject: {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
            defaultValue: null,
         },
         content: {
            allowNull: false,
            type: Sequelize.DataTypes.TEXT,
            defaultValue: null,
         },
         status: {
            allowNull: false,
            type: Sequelize.DataTypes.ENUM("pending", "sent", "failed"),
            defaultValue: "pending",
         },
         errorMessage: {
            allowNull: true,
            type: Sequelize.DataTypes.TEXT,
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
      return queryInterface.dropTable("mails");
   },
};
