'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tab_exercicio', {
      cod_exercicio: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
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
      nome_exercicio: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      url_exercicio: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      url_exercicio_empresa: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
        defaultValue: null
      },
      base_exercicio: {
        type: Sequelize.DataTypes.ENUM('S', 'N'),
        defaultValue: 'N'
      },
      cod_grupo_exercicio_1: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_2: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_3: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_4: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_5: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_6: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_7: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_8: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_9: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_grupo_exercicio_10: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_grupo_exercicio',
          key: 'cod_grupo_exercicio'
        }
      },
      cod_equipamento_1: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_equipamento',
          key: 'cod_equipamento'
        }
      },
      cod_equipamento_2: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_equipamento',
          key: 'cod_equipamento'
        }
      },
      cod_equipamento_3: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_equipamento',
          key: 'cod_equipamento'
        }
      },
      cod_articulacao_1: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_articulacao',
          key: 'cod_articulacao'
        }
      },
      cod_articulacao_2: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_articulacao',
          key: 'cod_articulacao'
        }
      },
      cod_articulacao_3: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_articulacao',
          key: 'cod_articulacao'
        }
      },
      cod_articulacao_4: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_articulacao',
          key: 'cod_articulacao'
        }
      },
      cod_padrao_movimento: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_padrao_movimento',
          key: 'cod_padrao_movimento'
        }
      },
      cod_tipo_exercicio: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_tipo_exercicio',
          key: 'cod_tipo_exercicio'
        }
      },
      cod_tipo_exercicio_2: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_tipo_exercicio',
          key: 'cod_tipo_exercicio'
        }
      },
      cod_exercicio_resistencia: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_exercicio_resistencia',
          key: 'cod_exercicio_resistencia'
        }
      },
      cod_indicacao: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_indicacao',
          key: 'cod_indicacao'
        }
      },
      cod_indicacao_2: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_indicacao',
          key: 'cod_indicacao'
        }
      },
      cod_indicacao_3: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'tab_indicacao',
          key: 'cod_indicacao'
        }
      },
      segundos_execucao: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      nivel_exercicio: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
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
    queryInterface.dropTable('tab_exercicio')
  }
};