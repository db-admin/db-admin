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
  let records = (await models.getModels(sequelize)[req.params.model].findAll()).map(record => record.dataValues);
  if (records.length > 0) {
    const unsortedColumnNames = Object.keys(records[0]);
    const sortedColumnNames: string[] = ["id"];
    unsortedColumnNames.forEach((col: string) => { if (!sortedColumnNames.some(x => x == col)) { sortedColumnNames.push(col); } });
    records = records.map((unsortedRecord: any) => {
      const sortedRecord: any = {};
      sortedColumnNames.forEach(col => sortedRecord[col] = unsortedRecord[col]);
      return sortedRecord;
    }).sort((a: any, b: any) => b.id - a.id); // sort by id
  }
  res.render("model/index", { records, title: req.params.model });
});

export = router;
