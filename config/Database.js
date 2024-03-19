const { Pool } = require('pg');

// Define your PostgreSQL database configuration
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'csvtojson',
  password: 'root',
  port: 5432, // Replace with your PostgreSQL port
};

// Create a PostgreSQL connection pool
const pool = new Pool(dbConfig);

module.exports = pool;
