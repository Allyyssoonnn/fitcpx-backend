'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_empresa_licenca_pagamento', {
      cod_empresa_licenca_pagamento: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_empresa_licenca: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_empresa_licenca',
          key: 'cod_empresa_licenca'
        }
      },
      data_empresa_licenca_pagamento: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
      },
      expiracao_empresa_licenca_pagamento: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
      },
      valor_empresa_licenca_pagamento: {
        type: Sequelize.DataTypes.FLOAT(22, 2),
        allowNull: false
      },
      forma_empresa_licenca_pagamento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      status_empresa_licenca_pagamento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      json_empresa_licenca_pagamento: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      },
      ambiente_empresa_licenca_pagamento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      stripe_payment_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      dev_stripe_payment_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      stripe_refund_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      dev_stripe_refund_id: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DataTypes.DATE,
        defaultValue: null
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tab_empresa_licenca_pagamento');
  }
};