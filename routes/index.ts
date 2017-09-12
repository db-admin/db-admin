import * as Express from "express";
import express = require("express");
import database = require("../modules/database");

const router = express.Router();

/* GET model */
router.get("/", function (req: Express.Request, res: Express.Response, next: Express.Handler) {
  res.render("index", { title: database.title, tables: database.models });
});

export = router;
