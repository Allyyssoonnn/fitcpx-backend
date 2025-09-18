// database/models/index.d.ts
import { Model, ModelStatic, Sequelize } from "sequelize";

interface Db {
   sequelize: Sequelize;
   Sequelize: typeof Sequelize;
   tab_usuario: ModelStatic<Model>;
   tab_empresa: ModelStatic<Model>;
   tab_aluno: ModelStatic<Model>;
   tab_refreshtoken_usuario: ModelStatic<Model>;
   tab_avaliacao: ModelStatic<Model>;
   tab_avaliacao_imagem: ModelStatic<Model>;
   tab_aluno_contrato: ModelStatic<Model>;
   tab_aluno_contrato_modalidade: ModelStatic<Model>;
   tab_modalidade_variacao: ModelStatic<Model>;
   tab_modalidade_variacao_valor: ModelStatic<Model>;
   tab_modalidade: ModelStatic<Model>;
   tab_aluno_contrato_pagamento: ModelStatic<Model>;
   tab_agenda: ModelStatic<Model>;
   tab_licenca: ModelStatic<Model>;
   tab_empresa_licenca: ModelStatic<Model>;
   tab_empresa_licenca_pagamento: ModelStatic<Model>;
   tab_plano: ModelStatic<Model>;
   tab_plano_modalidade: ModelStatic<Model>;
   tab_contrato: ModelStatic<Model>;
   tab_treino: ModelStatic<Model>;
   tab_sessao: ModelStatic<Model>;
   tab_sessao_exercicio: ModelStatic<Model>;
   tab_exercicio: ModelStatic<Model>;
   tab_grupo_exercicio: ModelStatic<Model>;
   tab_articulacao: ModelStatic<Model>;
   tab_equipamento: ModelStatic<Model>;
   tab_tipo_exercicio: ModelStatic<Model>;
   tab_exercicio_resistencia: ModelStatic<Model>;
   tab_indicacao: ModelStatic<Model>;
   tab_padrao_movimento: ModelStatic<Model>;
   feedbacks: ModelStatic<Model>;
}

declare const db: Db;
export default db;
