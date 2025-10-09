"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("tab_exercicios_empresa", {
         cod_exercicio_empresa: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
         },
         cod_exercicio: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: "tab_exercicio",
               key: "cod_exercicio",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
         },
         cod_empresa: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: "tab_empresa",
               key: "cod_empresa",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
         },
         url_exercicio_empresa: {
            type: Sequelize.STRING,
            allowNull: false,
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

      await queryInterface.addIndex("tab_exercicios_empresa", ["cod_exercicio"]);
      await queryInterface.addIndex("tab_exercicios_empresa", ["cod_empresa"]);
      await queryInterface.addIndex("tab_exercicios_empresa", ["cod_exercicio", "cod_empresa"], {
         name: "idx_exercicio_empresa_composite",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("tab_exercicios_empresa");
   },
};
