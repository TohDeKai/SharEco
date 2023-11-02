const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

//create impression
const createImpression = async (itemId, userId) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."impression" ("itemId", "userId", "impressionDate") 
      values ($1, $2, CURRENT_TIMESTAMP) returning *`,
      [itemId, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get impressions by itemId
const getImpressionsByItemId = async (itemId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."impression"
      WHERE "itemId" = $1`,
      [itemId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get distinct impression by itemId (if user has multiple impressions of same item, only consider latest)
const getDistinctImpressionsByItemId = async (itemId) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON ("userId") * FROM "sharEco-schema"."impression"
      WHERE "itemId" = $1
      ORDER BY "userId", "impressionDate" DESC`,
      [itemId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getImpressionsByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `
      SELECT i.*
      FROM "sharEco-schema"."impression" i
      INNER JOIN "sharEco-schema"."item" item ON i."itemId" = item."itemId"
      WHERE item."userId" = $1
      `,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getDistinctImpressionsByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT ON (i."userId", i."itemId") i.*
      FROM "sharEco-schema"."impression" i
      INNER JOIN "sharEco-schema"."item" item ON i."itemId" = item."itemId"
      WHERE item."userId" = $1
      ORDER BY i."userId", i."itemId", i."impressionDate" DESC;
      `,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  createImpression,
  getImpressionsByItemId,
  getDistinctImpressionsByItemId,
  getImpressionsByUserId,
  getDistinctImpressionsByUserId,
}