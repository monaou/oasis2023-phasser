const mysql = require('mysql2/promise');

async function createConnection() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            multipleStatements: true
        });
        return connection;
    } catch (error) {
        console.error('Error creating database connection:', error);
        throw error;
    }
}

module.exports = {
    createConnection
};
