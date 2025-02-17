'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_alimento', {
      cod_alimento: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_grupo_alimento: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_alimento',
          key: 'cod_grupo_alimento'
        }
      },
      cod_empresa: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: null,
        references: {
          model: 'tab_empresa',
          key: 'cod_empresa'
        }
      },
      cod_usuario: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: null,
        references: {
          model: 'tab_usuario',
          key: 'cod_usuario'
        }
      },
      nome_alimento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      imagem_alimento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      base_alimento: {
        type: Sequelize.DataTypes.ENUM('S', 'N'),
        defaultValue: 'N'
      },
      umidade: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      energia_kcal: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      energia_kj: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      proteina: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      lipideos: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      colesterol: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      carboidrato: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      fibra_alimentar: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      cinzas: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      calcio: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      magnesio: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      manganes: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      fosforo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      ferro: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      sodio: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      potassio: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      cobre: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      zinco: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      retinol: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      re: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      ra: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      tiamina: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      riboflavina: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      piridoxina: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      niacina: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
      },
      vitamina_c: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
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
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tab_alimento');
  }
};