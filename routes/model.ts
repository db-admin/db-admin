import * as Express from "express";
import "sequelize";
import express = require("express");
import DBAConfig = require("../dba.config");
import models = require("../models/db.tables");
import Sequelize = require("sequelize");

const dbConfig = DBAConfig.connections[DBAConfig.connection];
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  dialectOptions: { ssl: true },
  define: { freezeTableName: true }
});
const router = express.Router();

/* GET home page. */
router.get("/:model", async function (req: Express.Request, res: Express.Response, next: Express.Handler) {
  res.render("model/index", {
    records: (await models.getModels(sequelize)[req.params.model].findAll()).map(record => record.dataValues),
    title: req.params.model
  });
});

export = router;
