require('dotenv').config(); // <--- ADD THIS LINE AT THE TOP
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD || ''), // Force it to be a string
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};