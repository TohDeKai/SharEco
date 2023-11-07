const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Add to wishlist
const createWishList = async (itemId, userId) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."wishlist" ("itemId", "userId", "wishlistDate") 
      values ($1, $2, CURRENT_TIMESTAMP) returning *`,
      [itemId, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Remove from wishlist
const removeWishlist = async (itemId, userId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."wishlist"
      WHERE "itemId" = $1 AND "userId" = $2
      RETURNING *`,
      [itemId, userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get wishlist by itemId
const getWishlistByItemId = async (itemId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."wishlist"
      WHERE "itemId" = $1`,
      [itemId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get items by wishlist userId
const getItemsByWishlistUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT "item".*
      FROM "sharEco-schema"."item" AS "item"
      INNER JOIN "sharEco-schema"."wishlist" AS "wl" 
      ON "item"."itemId" = "wl"."itemId"
      WHERE "wl"."userId" = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get wishlist by itemId and userId
const getWishlistByItemIdAndUserId = async (itemId, userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."wishlist"
      WHERE "itemId" = $1 AND "userId" = $2`,
      [itemId, userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get likes by userId 
const getLikesByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `
      SELECT w.*
      FROM "sharEco-schema"."wishlist" w
      INNER JOIN "sharEco-schema"."item" item ON w."itemId" = item."itemId"
      WHERE item."userId" = $1
      `,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createWishList,
  removeWishlist,
  getWishlistByItemId,
  getItemsByWishlistUserId,
  getWishlistByItemIdAndUserId,
  getLikesByUserId,
}