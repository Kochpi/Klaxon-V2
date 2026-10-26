const mysql = require('mysql2/promise');

// Un "pool" garde plusieurs connexions ouvertes et les réutilise
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  dateStrings: true, // les dates restent du texte "AAAA-MM-JJ hh:mm:ss"
});

module.exports = pool;
