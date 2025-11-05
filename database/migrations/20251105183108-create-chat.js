"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("chat", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.DataTypes.INTEGER,
         },
         companyId: {
            allowNull: false,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
         },
         userId: {
            allowNull: true,
            type: Sequelize.DataTypes.INTEGER,
            references: {
               model: "tab_usuario",
               key: "cod_usuario",
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
         from: {
            type: Sequelize.DataTypes.ENUM("student", "company"),
            allowNull: false,
            defaultValue: "student",
         },
         status: {
            type: Sequelize.DataTypes.ENUM("read", "unread"),
            allowNull: false,
            defaultValue: "unread",
         },
         message: {
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

      await queryInterface.addIndex("chat", ["status", "createdAt"], {
         name: "idx_status_created",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeIndex("chat", "idx_status_created");
      return queryInterface.dropTable("chat");
   },
};
