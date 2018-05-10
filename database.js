const pool = async () => {
    const fs = require("fs");
    let dbaConfig;
    let dbConfig;
    try {
        dbaConfig = JSON.parse(fs.readFileSync("./dba.config.json", "utf8"));
        dbConfig = dbaConfig.connections[dbaConfig.connection];
    } catch (e) {
        throw new Error(
            "Error getting config file. Are you sure you created a dba.config.json file? \n"
            + "If not, please see the sample-dba.config.json file as an example. \n"
        );
    }
    const { Pool, Client } = require('pg')

    const pool = new Pool({
        user: dbConfig.username,
        host: dbConfig.host,
        database: dbConfig.database,
        password: dbConfig.password,
        port: dbConfig.port,
        ssl: dbConfig.ssl,
    })
    return pool;
};

/**
 * Gets all the schemas in the database.
 */
module.exports.getSchemas = async () => {
    return query("SELECT schema_name FROM information_schema.schemata");
}

/**
 * Gets all the tables in the given schema.
 * @param {string} schema the schema to get the tables from.
 */
module.exports.getTablesInSchema = async (schema) => {
    return query("SELECT * FROM information_schema.tables WHERE table_schema = $1", [schema]);
}

/**
 * Gets all the records from the given table. 
 * WARNING: This is NOT safe from sequel injection.
 * @param {string} tableName the table to get the records from.
 */
module.exports.getRecords = async (schema, table) => {
    return query(`SELECT * FROM ${schema}.${table}`);
}

/**
 * Gets the columns in the given table.
 * @param {string} table the table to get the columns for.
 */
module.exports.getColumns = async (schema, table) => {
    return query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2", [schema, table]);
}

/**
 * Gets the columns and records from a table. This is done in one network request.
 * NOTE: This does not protect from SQL injection.
 * @param {string} table the table name
 */
module.exports.getColumnsAndRecords = async (schema, table) => {
    return query(`
        SELECT column_name,data_type FROM information_schema.columns WHERE table_schema = '${schema}' AND table_name = '${table}';
        SELECT * FROM ${schema}.${table};
    `);
};

/**
 * Gets the columns of a table and a record with the given id.
 * @param {string} table the table name
 * @param {number} recordId the record id to get
 */
module.exports.getColumnsAndRecord = async (schema, table, recordId) => {
    return query(`
        SELECT column_name,data_type FROM information_schema.columns WHERE table_schema = '${schema}' AND table_name = '${table}';
        SELECT * FROM ${schema}.${table} where id = ${recordId};
    `);
}

module.exports.query = query;

/**
 * Executes a query against the database.
 * @param {string} query the query to execute
 * @param {string[]} vars variables to use in prepared statement
 */
async function query(query, vars) {
    const p = await pool();
    const queryResponse = await p.query(query, vars);
    p.end();
    return queryResponse;
};