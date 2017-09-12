interface DBAConfig {
    title: string;
    connection: string;
    connections: {
        [x: string]: {
            dialect: string;
            host: string;
            port: number;
            user: string;
            password: string;
            database: string;
        }
    }
}