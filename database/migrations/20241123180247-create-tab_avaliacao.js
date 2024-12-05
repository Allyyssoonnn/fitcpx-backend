'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_avaliacao', {
      cod_avaliacao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      cod_aluno: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_aluno',
          key: 'cod_aluno'
        }
      },
      data_avaliacao: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
      },
      tipo_avaliacao: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'simples'
      },
      peso: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      altura: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      metabolismo_basal: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      gordura_viceral: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      cod_protocolo: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_protocolo',
          key: 'cod_protocolo'
        }
      },
      metodo_dobras: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },

      // Campos de Dobras
      triciptal: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      peitoral: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      subescapular: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      axilar_media: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      abdominal: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      coxa: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      supra_iliaca: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      supra_espinhal: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      biciptal: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      panturrilha: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      // Campos de Perímetros
      pescoco: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      ombro: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      torax_inspirado: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      torax_expirado: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      punho: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      cintura: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      abdomen: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      quadril: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      // Campos de Perímetros Lado Direito
      braco_relaxado_direito: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      braco_contraido_direito: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      antebraco_direito: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      coxa_direita: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      panturrilha_direita: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      // Campos de Perímetros Lado Esquerdo
      braco_relaxado_esquerdo: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      braco_contraido_esquerdo: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      antebraco_esquerdo: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      coxa_esquerda: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      panturrilha_esquerda: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      // Campos de Diâmetro
      biestiloide_punho: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      biepicondilo_umeral: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      biepicondilo_femoral: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tab_avaliacao');
  }
};