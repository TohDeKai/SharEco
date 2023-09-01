require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();

// Choosing port for Express to listen on
const port = process.env.PORT || 4000;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Testing the database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client:", err.stack);
  }
  console.log("Connected to PostgreSQL database");
});

app.listen(port, () => {
  console.log(`Server is up and listening on Port ${port}`);
});
