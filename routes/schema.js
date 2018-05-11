const express = require("express");
const router = express.Router();
const database = require("../database");
const Record = require("../record.class");

router.get("/:schema/:table/:id", async (req, res, next) => {
    const schema = req.params.schema;
    const table = req.params.table;
    const id = req.params.id;
    const response = await database.getColumnsAndRecord(schema, table, id);
    const columns = response[0].rows;
    const record = new Record(response[1].rows[0], schema, table);

    res.render("record", {
        table: req.params.table,
        schema: req.params.schema,
        columns, record,
    });
});

router.post("/:schema/:table/:id", async (req, res, next) => {
    const schema = req.params.schema;
    const table = req.params.table;
    const id = req.params.id;
    const updated = new Record(req.body, schema, table);
    await database.updateRecord(schema, table, updated);
    res.redirect(`/schema/${schema}/${table}?highlight=${id}`);
});

router.get("/:schema/:table", async (req, res, next) => {
    const table = req.params.table;
    const schema = req.params.schema;
    const response = await database.getRecords(schema, table);
    const columns = response.fields;
    const records = response.rows.map(r => new Record(r, schema, table));
    await database.populateForeignValues(schema, table, records, columns);
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