/**
 * This file synchronizes the database model files to use when programming.
 */
import dbaConfig = require("./dba.config");

const SequelizeAuto = require("sequelize-auto");
const dbConfig = dbaConfig.connections[dbaConfig.connection];
const auto = new SequelizeAuto(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    directory: "models",
    port: dbConfig.port,
    typescript: true,
    dialectOptions: { ssl: true }
});

auto.run();