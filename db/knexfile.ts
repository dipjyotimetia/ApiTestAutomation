module.exports = {
    test:
    {
        client: 'mssql',
        connection: {
            user: "test",
            password: "Password1",
            server: "127.0.0.1",
            port: 1433,
            database: "TEST"
        },
        debug: false
    }
};