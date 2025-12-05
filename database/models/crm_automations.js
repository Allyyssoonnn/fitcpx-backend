module.exports = (sequelize, DataTypes) => {
   const crm_automations = sequelize.define(
      "crm_automations",
      {
         id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
         stageId: DataTypes.INTEGER,
         name: DataTypes.STRING,
         status: DataTypes.STRING,
         trigger: DataTypes.STRING,
         message: DataTypes.TEXT,
         delay: DataTypes.INTEGER,
      },
      {
         freezeTableName: true,
         paranoid: true,
      }
   );

   return crm_automations;
};
