'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_usuario_pagamento', {
      cod_usuario_pagamento: {
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
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_usuario',
          key: 'cod_usuario'
        },
        defaultValue: null
      },
      data_usuario_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.DATEONLY,
      },
      expiracao_usuario_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.DATEONLY,
      },
      valor_usuario_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.FLOAT(22, 2),
      },
      liquido_usuario_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.FLOAT(22, 2),
      },
      forma_usuario_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      parcela_usuario_pagamento: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      status_usuario_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      id_usuario_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      ambiente_usuario_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      tipo_usuario_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null,
      },
      json_usuario_pagamento: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
        defaultValue: null,
      },
      jsonwebhook_usuario_pagamento: {
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
    queryInterface.dropTable('tab_usuario_pagamento')
  }
};