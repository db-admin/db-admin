/**
 * Configuration file for DBAdmin
 */
export = <DBAConfig>{
  /**
   * The title of the application.
   */
  title: "My Amazing DBAdmin App",

  /**
   * The connection to use from the list of connections provided.
   */
  connection: "myDatabase",

  /**
   * The list of connections to choose from. You must have at least one db connection.
   */
  connections: {

    myDatabase: {
      dialect: `"mysql" | "mariadb" | "sqlite" | "postgres" | "mssql"`,
      host: "url.to.database",
      port: 5432,
      user: "user name",
      password: "password",
      database: "database name",
      ssl: true,
    },

    someOtherDatabase: {
      dialect: `"mysql" | "mariadb" | "sqlite" | "postgres" | "mssql"`,
      host: "url.to.database",
      port: 5432,
      user: "user name",
      password: "password",
      database: "database name",
      ssl: false,
    }
  }
};
