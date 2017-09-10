import * as Express from "express";

const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req: Express.Request, res: Express.Response, next: Express.Handler) {
  res.send("respond with a resource");
});

export = router;
