'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_aluno_sessao_pacote', {
      cod_aluno_sessao_pacote: {
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
      nome_aluno_sessao_pacote: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      status_aluno_sessao_pacote: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      formapagamento_aluno_sessao_pacote: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      expiracao_aluno_sessao_pacote: {
        allowNull: false,
        type: Sequelize.DataTypes.DATEONLY,
      },
      valor_aluno_sessao_pacote: {
        allowNull: true,
        type: Sequelize.DataTypes.DOUBLE(22,2),
        defaultValue: null
      },
      ambiente_aluno_sessao_pacote: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      dev_stripe_payment_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      stripe_payment_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      dev_stripe_refund_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      stripe_refund_id: {
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
    queryInterface.dropTable('tab_aluno_sessao_pacote')
  }
};