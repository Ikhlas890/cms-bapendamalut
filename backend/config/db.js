const mysql = require('mysql2/promise');
require('dotenv').config();

const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.PORT || 3306,
    dateStrings: true, 
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0  
});

dbPool.getConnection((err, connection) => {
    if (err) {
        console.error('Error getting connection from pool:', err);
        return;
    }
    console.log('Database connected...');
    connection.release();  
});

module.exports = dbPool;
