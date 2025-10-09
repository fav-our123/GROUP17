// db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Render requires SSL
});

module.exports = pool;