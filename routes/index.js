const express = require('express');
const router = express.Router();
const database = require("../database");

/* GET home page. */
router.get('/', async (req, res, next) => {
  const schemas = await database.getSchemas();
  res.render('index', { title: 'Express', schemas: schemas.rows.map(r => r.schema_name) });
});

module.exports = router;