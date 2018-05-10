const express = require("express");
const router = express.Router();
const database = require("../database");

router.get("/:schema/:table", async (req, res, next) => {
    const pool = await database();
    const table = req.params.table;
    const response = await pool.query(`SELECT * FROM ${table}`);
    const records = response.rows.map(r => ({
        id: r.id,
        name: r.name || r.title,
        values: Object.values(r),
    }));
    let columns = await pool.query("select column_name,data_type from information_schema.columns where table_name = $1", [table]);
    columns = columns.rows;
    pool.end();
    res.render("table", {
        table: req.params.table,
        schema: req.params.schema,
        columns, records,
    });
});

router.get("/:schema", async (req, res, next) => {
    const pool = await database();
    const schema = req.params.schema;
    const response = await pool.query("SELECT * FROM information_schema.tables WHERE table_schema = $1", [schema]);
    const results = response.rows.map(r => r.table_name);
    pool.end();
    res.render("schema", { tables: results, schema });
});

module.exports = router;