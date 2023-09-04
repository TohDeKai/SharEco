const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

// Set the path to your .env file (assuming it's in the same directory as server.js)
const envPath = path.resolve(__dirname, ".env");

// Load the environment variables from the specified file
dotenv.config({ path: envPath });

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

// middleware
app.use(cors());
app.use(express.json());

// Register and Login routes
app.use("/auth", require("../routes/jwtAuth"));

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
