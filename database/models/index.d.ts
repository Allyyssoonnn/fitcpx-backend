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
}

declare const db: Db;
export default db;
