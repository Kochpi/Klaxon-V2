const mysql = require('mysql2/promise');

/**
 * Pool de connexions MySQL.
 * - namedPlaceholders : requêtes préparées avec :nom au lieu de ?
 * - dateStrings : les DATETIME restent des chaînes "AAAA-MM-JJ hh:mm:ss",
 *   ce qui évite les conversions de fuseau horaire implicites.
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  dateStrings: true,
});

module.exports = pool;
