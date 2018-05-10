const express = require("express");
const router = express.Router();
const database = require("../database");

router.get("/:schema/:table/:id", async (req, res, next) => {
    const pool = await database();
    let columns = database.getColumns(req.params.table);
});

router.get("/:schema/:table", async (req, res, next) => {
    const table = req.params.table;
    const response = await database.getColumnsAndRecords(table);
    const columns = response[0].rows;
    const records = response[1].rows.map(r => ({
        id: r.id,
        name: r.name,
        values: Object.values(r),
    }));

    res.render("table", {
        table: req.params.table,
        schema: req.params.schema,
        columns, records,
    });
});

router.get("/:schema", async (req, res, next) => {
    const schema = req.params.schema;
    const response = await database.getTablesInSchema(schema);
    const results = response.rows.map(r => r.table_name);
    res.render("schema", { tables: results, schema });
});

module.exports = router;