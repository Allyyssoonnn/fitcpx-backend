"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("device_tokens", {
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
         token: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
         },
         platform: {
            allowNull: true,
            type: Sequelize.DataTypes.ENUM("IOS", "Android", "Web"),
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

      await queryInterface.addIndex("device_tokens", ["token"], {
         name: "idx_device_tokens_token",
         unique: false,
      });
   },

   async down(queryInterface, Sequelize) {
      return queryInterface.dropTable("device_tokens");
   },
};
