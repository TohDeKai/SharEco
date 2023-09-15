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
    const result = await pool.query('SELECT * FROM "sharEco-schema"."user"');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get a user by ID
const getUserById = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."user" 
    WHERE "userId" = $1`,
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
      `SELECT * FROM "sharEco-schema"."user" 
      WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Get user by username and password
const getUserByUsernameAndPassword = async (username, password) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."user" WHERE username = $1 AND password = $2`,
      [username, password]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Create a user
// User will be created with isBanned = false, likedItem & wishList = []
// Each user will not be banned and have an empty likedItem and wishList upon creation
const createUser = async (
  password,
  email,
  contactNumber,
  userPhotoUrl,
  displayName,
  username,
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."user" 
        (username, password, email, "contactNumber", "userPhotoUrl", "isBanned", "likedItem", "wishList", "displayName") values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [
        username,
        password,
        email,
        contactNumber,
        "",
        false,
        [],
        [],
        displayName,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update user
const updateUser = async (
  userId,
  username,
  password,
  email,
  contactNumber,
  userPhotoUrl,
  isBanned,
  likedItem,
  wishList,
  displayName
) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
      SET username = $1, 
      password = $2,
      email = $3,
      "contactNumber" = $4,
      "userPhotoUrl" = $5,
      "isBanned" = $6,
      "likedItem" = $7,
      "wishList" = $8,
      "displayName" = $9
      WHERE "userId" = $10
      RETURNING *`,
      [
        username,
        password,
        email,
        contactNumber,
        userPhotoUrl,
        isBanned,
        likedItem,
        wishList,
        displayName,
        userId,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const updateAccountUser = async (username, email, contactNumber) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" SET email = $1, "contactNumber" = $2 WHERE username = $3 RETURNING *`,
      [email, contactNumber, username]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."user" 
      WHERE "userId" = $1
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
  getUserByUsernameAndPassword,
  createUser,
  updateUser,
  deleteUser,
  updateAccountUser,
  getUserByUsername,
};
