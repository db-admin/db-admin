/**
 * Configuration file for DBAdmin
 */
export = {
    /**
     * The title of the application.
     */
    title: "My Amazing App",

    /**
     * The connection to use from the list of connections provided.
     */
    connection: "database1",

    /**
     * The list of connections to choose from. You must have at least one db connection.
     */
    connections: {

        myPostgresDb: {
            adapter: "sails-postgresql",
            host: "databasehostname.somegibberish.us-west-2.rds.amazonaws.com",
            user: "db_user",
            password: "secret_password",
            database: "databasename"
        },

        "local-disk": {
            adapter: "sails-disk"
        }
    }
};