import * as Express from "express";
import "sequelize";
import express = require("express");
import database = require("../modules/database");

const router = express.Router();

/* GET home page. */
router.get("/:model", async function (req: Express.Request, res: Express.Response, next: Express.Handler) {
  let records = (await database.models[req.params.model].findAll()).map(record => record.dataValues);
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
