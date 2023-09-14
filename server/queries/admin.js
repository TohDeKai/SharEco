const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Get all admin
const getAdmins = async () => {
  try {
    const result = await pool.query('SELECT * FROM "sharEco-schema"."admin"');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get a admin by ID
const getAdminById = async (adminId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."admin" 
    WHERE "adminId" = $1`,
      [adminId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Get admin by username
const getAdminByUsername = async (username) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."admin" 
      WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Create an admin
const createAdmin = async (username, password) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."admin" 
      (username, password) values ($1, $2) returning *`,
      [username, password]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update admin
const updateAdmin = async (adminId, username, password) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."admin" 
      SET username = $1, 
      password = $2
      WHERE "adminId" = $3
      RETURNING *`,
      [username, password, adminId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Delete admin
const deleteAdmin = async (adminId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."admin" 
      WHERE "adminId" = $1
      RETURNING *`,
      [adminId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminByUsername,
};
