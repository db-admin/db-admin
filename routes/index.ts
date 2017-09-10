import * as Express from "express";
import express = require("express");
import router = express.Router;

/* GET home page. */
router.get("/", function (req: Express.Request, res: Express.Response, next: Express.Handler) {
  res.render("index", { title: "Exdsspress" });
});

export = router;
