"use strict";
const express = require("express");
const database = require("../modules/database");
const router = express.Router();
/* GET model */
router.get("/", function (req, res, next) {
    res.render("index", { title: database.title, tables: database.models });
});
module.exports = router;
//# sourceMappingURL=index.js.map