module.exports = async () => {
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

    // const res = await pool.query('SELECT NOW()')
    // console.log(res)
    // pool.end()
};