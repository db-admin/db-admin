"use strict";
require("sequelize");
const express = require("express");
const DBAConfig = require("../dba.config");
const models = require("../models/db.tables");
const Sequelize = require("sequelize");
const dbConfig = DBAConfig.connections[DBAConfig.connection];
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectOptions: { ssl: true },
    define: { freezeTableName: true }
});
const router = express.Router();
/* GET model */
router.get("/", function (req, res, next) {
    res.render("index", { title: DBAConfig.title, tables: models.getModels(sequelize) });
});
module.exports = router;
//# sourceMappingURL=index.js.map