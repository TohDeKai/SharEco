const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Create Advertisement
const createAd = async (image, title, description, bidPrice, bizId, link) => {
  try {
    const startDate = getStartBidDate();
    const endDate = getStartBidDate();
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."advertisement" 
         ("startDate", "endDate", "image", "title", "description", "bidPrice", "status", "bizId", "link") 
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [startDate, endDate, image, title, description, bidPrice, "PENDING", bizId, link]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update images for an ad
const updateAdImage = async (adId, image) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."advertisement" 
        SET image = $1
        WHERE "advertisementId" = $2
        RETURNING image`,
      [image, adId]
    );

    if (result) {
      return result.rows[0].image;
    } else {
      return null; // Return null if the item is not found or the update fails
    }
  } catch (err) {
    throw err;
  }
};

const getStartBidDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = 0 - dayOfWeek + 7 + 1;
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);
  nextSunday.setHours(0, 0, 0, 0);

  return nextSunday;
};

const editAd = async (adId, image, title, description, bidPrice, link) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."advertisement" 
        SET "image" = $1, 
        "title" = $2
        "description" = $3,
        "bidPrice" = $4,
        "link" = $6
        WHERE "advertisementId" = $5
        RETURNING *`,
      [image, title, description, bidPrice, adId, link]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const deleteAd = async (adId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."advertisement" 
           WHERE "advertisementId" = $1
           RETURNING *`,
      [adId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getAdByAdId = async (adId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."advertisement" 
                WHERE "advertisementId" = $1`,
      [adId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getAdsByBizId = async (bizId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."advertisement" 
         WHERE "bizId" = $1`,
      [bizId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getWeekAdsByStartDate = async (startDate) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."advertisement" 
             WHERE "startDate" >= $1 AND "startDate" <= $2
             ORDER BY "bidPrice" DESC`,
      [startDate, endDate.toISOString().split("T")[0]]
    );
    console.log(startDate);
    console.log('Query Result:', endDate.toISOString().split("T")[0]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createAd,
  updateAdImage,
  editAd,
  deleteAd,
  getAdByAdId,
  getAdsByBizId,
  getWeekAdsByStartDate,
};
