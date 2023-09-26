const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Create item
const createItem = async (
  userId,
  itemTitle,
  itemDescription,
  itemOriginalPrice,
  rentalRateHourly,
  rentalRateDaily,
  depositFee,
  images,
  category,
  collectionLocations,
  otherLocation
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."item" 
        ("userId", "itemTitle", "itemDescription", "itemOriginalPrice", "rentalRateHourly", "rentalRateDaily", "depositFee", images, category, "collectionLocations", "otherLocation", "usersLikedCount", impressions, "totalRentCollected") 
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning *`,
      [
        userId,
        itemTitle,
        itemDescription,
        itemOriginalPrice,
        rentalRateHourly,
        rentalRateDaily,
        depositFee,
        images,
        category,
        collectionLocations,
        otherLocation,
        0,
        0,
        0,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update item
const updateItem = async (
  itemId,
  itemTitle,
  itemDescription,
  itemOriginalPrice,
  rentalRateHourly,
  rentalRateDaily,
  depositFee,
  images,
  category,
  collectionLocations,
  otherLocation
) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."item" 
        SET "itemTitle" = $1, 
        "itemDescription" = $2,
        "itemOriginalPrice" = $3,
        "rentalRateHourly" = $4,
        "rentalRateDaily" = $5,
        "depositFee" = $6,
        images = $7,
        category = $8,
        "collectionLocations" = $9,
        "otherLocation" = $10
        WHERE "itemId" = $11
        RETURNING *`,
      [
        itemTitle,
        itemDescription,
        itemOriginalPrice,
        rentalRateHourly,
        rentalRateDaily,
        depositFee,
        images,
        category,
        collectionLocations,
        otherLocation,
        itemId,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Delete item
const disableItem = async (itemId) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."item" 
       SET "disabled" = true
       WHERE "itemId" = $1
        RETURNING *`,
      [itemId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

//Get item by item Id
const getItemByItemId = async (itemId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."item" 
        WHERE "itemId" = $1`,
      [itemId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

//Get items by user Id
//Available listings
const getItemsByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."item" 
          WHERE "userId" = $1 AND "disabled" != true`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get All Items
const getAllItems= async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."item" 
          WHERE "disabled" != true`,
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get all items listed by other users
const getOtherUserItems= async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."item" 
          WHERE "userId" != $1 AND "disabled" != true`,
          [userId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createItem,
  updateItem,
  disableItem,
  getItemByItemId,
  getItemsByUserId,
  getAllItems,
  getOtherUserItems,
};
