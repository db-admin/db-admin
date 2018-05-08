try {
  require("../dba.config");
} catch (e) {
  throw new Error(
    "No DBA config file found. "
    + "Please create a dba.config.ts (or js) file. See a sample at sample-dba-config.ts."
  );
}
try {
  require("../models/db.tables");
} catch (e) {
  throw new Error(
    "Error fetching ../models/db.tables.js. "
    + "You must create this file, or run `npm run sync-db` to sync your entire database."
  );
}

import "sequelize";
import Sequelize = require("sequelize");
import DBAConfig = require("../dba.config");
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
