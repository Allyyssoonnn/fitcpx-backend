'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_aluno_contrato_pagamento', {
      cod_aluno_contrato_pagamento: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_aluno_contrato: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_aluno_contrato',
          key: 'cod_aluno_contrato'
        }
      },
      data_aluno_contrato_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.DATEONLY,
      },
      expiracao_aluno_contrato_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.DATEONLY,
      },
      valor_aluno_contrato_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.FLOAT(22, 2),
      },
      liquido_aluno_contrato_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.FLOAT(22, 2),
      },
      forma_aluno_contrato_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      status_aluno_contrato_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      statustexto_aluno_contrato_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      observacao_aluno_contrato_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      id_aluno_contrato_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      ambiente_aluno_contrato_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      json_aluno_contrato_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
        defaultValue: null,
      },
      jsonwebhook_aluno_contrato_pagamento: {
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
        defaultValue: null
      },
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('tab_aluno_contrato_pagamento')
  }
};