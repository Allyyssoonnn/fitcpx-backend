module.exports = (sequelize, DataTypes) => {
   const crm_pipelines = sequelize.define(
      "crm_pipelines",
      {
         id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
         name: DataTypes.STRING,
      },
      {
         freezeTableName: true,
         paranoid: true,
      }
   );

   return crm_pipelines;
};
