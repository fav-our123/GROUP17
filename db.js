const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.postgresql,//csc_dept_user:cXR49dWsnFEzszsRaDOrthcVmNuLxKud@dpg-d3jr85ur433s739i5a2g-a.oregon-postgres.render.com/csc_dept;
  ssl: {
    rejectUnauthorized: false // Required for Render's managed PostgreSQL
  }
});

module.exports = pool;