const fs = require('fs').promises;
const mysql = require('mysql2/promise');
const { createConnection } = require('./database');

async function updateDatabase(user, ticketType, ticketNum) {
    let connection;
    try {
        connection = await createConnection();
        await connection.execute(
            'INSERT INTO ticket_purchases (user_address, ticket_type, ticket_num) VALUES (?, ?, ?)',
            [user, ticketType.toNumber(), ticketNum.toNumber()]
        );
    } catch (error) {
        console.error('Error updating database for TicketPurchased:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function updateDatabaseWithTicketInfo(ticketType, ticketPrice, isTicketRange, ticketMaxNum, ticketName) {
    let connection;
    try {
        connection = await createConnection();
        await connection.execute(
            'INSERT INTO ticket_info (ticket_type, ticket_price, is_ticket_range, ticket_max_num, ticket_name) VALUES (?, ?, ?, ?, ?)',
            [ticketType.toNumber(), ticketPrice.toNumber(), isTicketRange, ticketMaxNum.toNumber(), ticketName]
        );
    } catch (error) {
        console.error('Error updating database for TicketInfoPurchased:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function createTables() {
    let connection;
    try {
        connection = await createConnection();
        // Read the SQL file
        const createTableSql = await fs.readFile('./createTables.sql', 'utf-8');

        // Execute the SQL queries to create tables
        await connection.query(createTableSql);
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

module.exports = {
    updateDatabase,
    updateDatabaseWithTicketInfo,
    createTables,
};
