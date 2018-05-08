/**
 * This file synchronizes the database model files to use when programming.
 */
import dbaConfig = require("./dba.config");
import fs = require("fs");

const SequelizeAuto = require("sequelize-auto");
const dbConfig = dbaConfig.connections[dbaConfig.connection];
console.log(dbConfig);
const auto = new SequelizeAuto(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  directory: "models",
  port: dbConfig.port,
  typescript: true,
  dialectOptions: { ssl: dbConfig.ssl },
  additional: {
    timestamps: false,
  },
});

auto.run((error: Error) => {
  if (error) throw error;
  if (!fs.existsSync("./models")) {
    throw new Error(
      "Failed to create models for database. "
      + "We're not sure why this happened. Are you sure the database credentials are correct in ./dba-config.ts (or .js)?"
    );
  }
  process.exit();
});
