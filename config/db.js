// db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10), // port must be a number
  ssl: {
    rejectUnauthorized: false // required for Neon
  }
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
