// database/models/index.d.ts
import { Model, ModelStatic, Sequelize } from "sequelize";

interface Db {
   sequelize: Sequelize;
   Sequelize: typeof Sequelize;
   tab_usuario: ModelStatic<Model>;
   tab_empresa: ModelStatic<Model>;
   tab_aluno: ModelStatic<Model>;
   tab_refreshtoken_usuario: ModelStatic<Model>;
   // demais models
}

declare const db: Db;
export default db;
