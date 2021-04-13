// get the client
const mysql = require('mysql2');
const fs = require('fs')
const { promisify } = require('util')

// Create the connection pool. The pool-specific settings are the defaults
const connection = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    database: process.env.database,
    password: process.env.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const InitConnection = async () => {
    try {
        const data = await fs.readFileSync('./init.sql', 'utf-8');
        connection.query(data, (err, result) => {
            console.log(err);
            if (!err) {
                console.log('synced database')
            }
        })
    } catch (error) {
        console.log(error, "error occured could not execure script")
    }
}

const query = promisify(connection.query).bind(connection);

// connection.

module.exports = {
    InitConnection,
    connection,
    query
}