const express = require("express");
const router = express.Router();
const database = require("../database");
const Record = require("../record.class");

router.get("/:schema/:table/:id", async (req, res, next) => {
    const id = req.params.id;
    const schema = req.params.schema;
    const table = req.params.table;
    const foreignRecords = await database.getForeignRecords(schema, table);
    let columns;
    let record;

    if (id == "create") {
        columns = await database.getColumns(schema, table);
        columns = columns.rows;
    } else {
        const columnsAndRecord = await database.getColumnsAndRecord(schema, table, id);
        columns = columnsAndRecord[0].rows;
        record = columnsAndRecord[1].rows[0];
    }
    res.render("record", { table, schema, columns, record, foreignRecords });
});

router.post("/:schema/:table/create", async (req, res, next) => {
    const schema = req.params.schema;
    const table = req.params.table;
    const created = new Record(req.body, schema, table);
    const response = await database.insertRecord(schema, table, created);
    const id = response.rows[0].id;
    res.redirect(`/schema/${schema}/${table}?highlight=${id}`);
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