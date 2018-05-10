const express = require('express');
const router = express.Router();
const database = require("../database");

/* GET home page. */
router.get('/', async (req, res, next) => {
  const pool = await database();
  const response = await pool.query("select schema_name from information_schema.schemata");
  const schemas = response.rows.map(r => r.schema_name);
  res.render('index', { title: 'Express', schemas });
});

module.exports = router;