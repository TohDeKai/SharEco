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

// Get total number of users (exclude admin)
const getTotalNumberOfUsers = async () => {
  try {
    const result = await pool.query(
      `SELECT COUNT("userId") FROM "sharEco-schema"."user" WHERE NOT "userId" = $1`,
      [1]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
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
// User will be created with isBanned = false
// Each user will not be banned
const createUser = async (
  password,
  email,
  contactNumber,
  displayName,
  username,
  verification
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."user" 
        (username, password, email, "contactNumber", "userPhotoUrl", "isBanned", "displayName", "aboutMe", "walletBalance", "walletId","verification") values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
      [
        username,
        password,
        email,
        contactNumber,
        null,
        false,
        displayName,
        "",
        0,
        "",
        verification,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update user
const updateUser = async (
  oldUsername,
  newUsername,
  password,
  email,
  contactNumber,
  userPhotoUrl,
  isBanned,
  displayName,
  aboutMe
) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
      SET username = $2, 
      password = $3,
      email = $4,
      "contactNumber" = $5,
      "userPhotoUrl" = $6,
      "isBanned" = $7,
      "displayName" = $8,
      "aboutMe" = $9
      WHERE "username" = $1
      RETURNING *`,
      [
        oldUsername,
        newUsername,
        password,
        email,
        contactNumber,
        userPhotoUrl,
        isBanned,
        displayName,
        aboutMe,
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

// Add business verification request to user
// User will set its businessVerificationId to that and BusinessVerification will set its originalUserId to that
// Returns user
const addVerificationToUser = async (userId, businessVerificationId) => {
  try {
    await pool.query(
      `UPDATE "sharEco-schema"."businessVerification" 
    SET "originalUserId" = $1
    WHERE "businessVerificationId" = $2
    RETURNING *`,
      [userId, businessVerificationId]
    );

    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
    SET "businessVerificationId" = $1
    WHERE "userId" = $2
    RETURNING *`,
      [businessVerificationId, userId]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Add wallet ID to user
const addWalletIdToUser = async (userId, walletId) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
    SET "walletId" = $1
    WHERE "userId" = $2
    RETURNING *`,
      [walletId, userId]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// get wallet ID by user ID
const getWalletIdByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT "walletId" FROM "sharEco-schema"."user" 
    WHERE "userId" = $1`,
      [userId]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// get wallet balance by user ID
const getWalletBalanceByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT "walletBalance" FROM "sharEco-schema"."user" 
    WHERE "userId" = $1`,
      [userId]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// update user wallet balance
const updateUserWalletBalance = async (userId, walletBalance) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
    SET "walletBalance" = $1
    WHERE "userId" = $2
    RETURNING *`,
      [walletBalance, userId]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

updateAdminWalletBalance = async (walletBalance) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
    SET "walletBalance" = $1
    WHERE "userId" = $2
    RETURNING *`,
      [walletBalance, 1]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

verifyUser = async (username) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
    SET "verification" = $1
    WHERE "username" = $2
    RETURNING *`,
      ["VERIFIED", username]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

getUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."user" 
    WHERE "email" = $1`,
      [email]
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
  addVerificationToUser,
  addWalletIdToUser,
  getWalletIdByUserId,
  updateUserWalletBalance,
  getWalletBalanceByUserId,
  getTotalNumberOfUsers,
  updateAdminWalletBalance,
  verifyUser,
  getUserByEmail,
};
