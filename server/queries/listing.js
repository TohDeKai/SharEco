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
  otherLocation,
  isBusiness,
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."item" 
        ("userId", "itemTitle", "itemDescription", "itemOriginalPrice", "rentalRateHourly", "rentalRateDaily", "depositFee", images, category, "collectionLocations", "otherLocation", "usersLikedCount", impressions, "totalRentCollected", "isBusiness") 
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning *`,
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
        isBusiness,
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

// Update images for an item
const updateItemImages = async (itemId, images) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."item" 
        SET images = $1
        WHERE "itemId" = $2
        RETURNING images`,
      [images, itemId]
    );

    if (result.rows.length > 0) {
      return result.rows[0].images;
    } else {
      return null; // Return null if the item is not found or the update fails
    }
  } catch (err) {
    throw err;
  }
};

// Delete item
const disableItem = async (itemId, disabled) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."item" 
       SET "disabled" = $1
       WHERE "itemId" = $2
        RETURNING *`,
      [disabled, itemId]
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

//Full text search for other user's items
const getOtherUserItemsByKeywords = async (userId, keywords) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM "sharEco-schema"."item"
      WHERE
        "userId" != $1
        AND "disabled" != true
        AND "document_with_weights" @@ to_tsquery('english', $2)
      ORDER BY ts_rank("document_with_weights", to_tsquery('english', $2)) DESC;
      `,
      [userId, keywords]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};



//Get all items listed by other users by category
const getOtherUserItemsByCategory= async (userId, category) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."item" 
          WHERE "userId" != $1 AND "category" = $2 AND "disabled" != true`,
          [userId, category]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
}

//Full text search for other user's items by category
const getOtherUserItemsByCategoryByKeywords = async (userId, category, keywords ) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM "sharEco-schema"."item"
      WHERE
        "userId" != $1
        AND "category" = $2
        AND "disabled" != true
        AND "document_with_weights" @@ to_tsquery('english', $3)
      ORDER BY ts_rank("document_with_weights", to_tsquery('english', $3)) DESC;
      `,
      [userId, category, keywords]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};


module.exports = {
  createItem,
  updateItem,
  updateItemImages,
  disableItem,
  getItemByItemId,
  getItemsByUserId,
  getAllItems,
  getOtherUserItems,
  getOtherUserItemsByCategory,
  getOtherUserItemsByKeywords,
  getOtherUserItemsByCategoryByKeywords,
};
