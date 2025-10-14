const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config.json")[env];
const db = {};

let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, {
   ...config,
   logging: false,
   pool: {
      max: 10, // Máximo de conexões simultâneas abertas
      min: 1, // Mínimo de conexões que o pool mantém abertas
      acquire: 30000, // Tempo máximo em ms que Sequelize espera para pegar uma conexão antes de dar erro
      idle: 10000, // Tempo que uma conexão ociosa fica no pool antes de ser liberada
   },
});

fs.readdirSync(__dirname)
   .filter((file) => {
      return (
         file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && file.indexOf(".test.js") === -1
      );
   })
   .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
   });

Object.keys(db).forEach((modelName) => {
   if (db[modelName].associate) {
      db[modelName].associate(db);
   }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
