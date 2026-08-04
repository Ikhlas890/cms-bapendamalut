const mysql = require('mysql2/promise');
require('dotenv').config();

const dbPort = Number(process.env.DB_PORT || 3306);

const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: dbPort,
    dateStrings: true, 
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0  
});

dbPool.getConnection()
    .then((connection) => {
        console.log('Database connected...');
        connection.release();
    })
    .catch((err) => {
        console.error('Error getting connection from pool:', err.message);
    });

module.exports = dbPool;
