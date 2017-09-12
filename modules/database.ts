import "sequelize";
import DBAConfig = require("../dba.config");
import Sequelize = require("sequelize");
import models = require("../models/db.tables");
const dbConfig = DBAConfig.connections[DBAConfig.connection];
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectOptions: { ssl: true },
    define: { freezeTableName: true }
});
export = {
    models: models.getModels(sequelize),
    title: DBAConfig.title
};
