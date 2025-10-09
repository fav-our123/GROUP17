// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'futo_dept',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the promise-based pool
module.exports = pool.promise();

/*
🛠️ Setup note:
If you ever need to hash a new admin password, open your Node terminal and run:

const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(console.log);

Then copy the hash and manually insert it into your `admins` table.
*/
