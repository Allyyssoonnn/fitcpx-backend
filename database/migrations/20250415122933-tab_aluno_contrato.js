'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_aluno_contrato', {
      cod_aluno_contrato: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_empresa: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_empresa',
          key: 'cod_empresa'
        }
      },
      cod_usuario: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_usuario',
          key: 'cod_usuario'
        }
      },
      cod_aluno: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_aluno',
          key: 'cod_aluno'
        }
      },
      nome_aluno_contrato: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      iniciopagamento_aluno_contrato: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
      },
      status_aluno_contrato: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      statustexto_aluno_contrato: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      observacao_aluno_contrato: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      adesao_aluno_contrato: {
        allowNull: true,
        type: Sequelize.DataTypes.DOUBLE(22,2),
        defaultValue: null
      },
      parcela_aluno_contrato: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
        defaultValue: null
      },
      total_aluno_contrato: {
        allowNull: true,
        type: Sequelize.DataTypes.DOUBLE(22,2),
        defaultValue: null
      },
      expiracao_aluno_contrato: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
      },
      modalidades_aluno_contrato: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      arquivo_aluno_contrato: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      id_aluno_contrato: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      autentique_aluno_contrato: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      statusautentique_aluno_contrato: {
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
        defaultValue: null
      },
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('tab_aluno_contrato')
  }
};