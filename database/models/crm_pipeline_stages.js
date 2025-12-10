module.exports = (sequelize, DataTypes) => {
   const crm_pipeline_stages = sequelize.define(
      "crm_pipeline_stages",
      {
         id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
         pipelineId: DataTypes.INTEGER,
         sequence: DataTypes.INTEGER,
         name: DataTypes.STRING,
         color: DataTypes.STRING,
      },
      {
         freezeTableName: true,
         paranoid: true,
      }
   );

   return crm_pipeline_stages;
};
