const mysql = require('mysql2/promise');
const config = require('../env/mysqlConfig');

console.log("Database configured:", config.database);

const pool = mysql.createPool(config);

module.exports = pool;