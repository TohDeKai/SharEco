const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Get all users
const getUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM "sharEco-schema"."account"');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get a user by ID
const getUserById = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."account" 
    WHERE "accountId" = $1`,
      [userId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Get user by username
const getUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."account" 
      WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Create a user
const createUser = async (username, password) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."account" 
      (username, password) values ($1, $2) returning *`,
      [username, password]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update user
const updateUser = async (userId, username, password) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."account" 
      SET username = $1, 
      password = $2 
      WHERE "accountId" = $3
      RETURNING *`,
      [username, password, userId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."account" 
      WHERE "accountId" = $1
      RETURNING *`,
      [userId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername,
};
