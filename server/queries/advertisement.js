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
      [
        startDate,
        endDate,
        image,
        title,
        description,
        bidPrice,
        "PENDING",
        bizId,
        link,
      ]
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
  // If it's saturday (vetting period, end of bidding week)
  if (today.getDay() === 6) {
    // Move onto next week
    today.setDate(today.getDate() + 7);
  }
  const dayOfWeek = today.getDay();
  const daysUntilSunday = 7 - dayOfWeek;
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);
  nextSunday.setHours(0, 0, 0, 0);
  console.log("Start Bid Date: ", nextSunday);
  return nextSunday;
};

const editAd = async (adId, image, title, description, bidPrice, link) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."advertisement" 
        SET "image" = $1, 
        "title" = $2,
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
             WHERE "startDate" >= $1 AND "endDate" <= $2
             ORDER BY "bidPrice" DESC`,
      [startDate, endDate.toISOString().split("T")[0]]
    );
    console.log(startDate);
    console.log("Query Result:", endDate.toISOString().split("T")[0]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const rankWeekAds = async () => {
  try {
    const startDate = getStartBidDate();
    const ads = await getWeekAdsByStartDate(startDate);
    const pendingAds = ads.filter((ad) => ad.status === "PENDING");
    pendingAds.sort((ad1, ad2) => ad2.bidPrice - ad1.bidPrice);
    console.log(ads);
    return pendingAds;
  } catch (err) {
    throw err;
  }
};

// Get remaining approved ads
const getAllWeeklyAds = async () => {
  try {
    const startDate = getStartBidDate();
    const ads = await getWeekAdsByStartDate(startDate);
    const pendingAds = ads.filter((ad) => ad.status === "PENDING");
    const remaining = ads.length - pendingAds.length;
    console.log(remaining);
    return remaining;
  } catch (err) {
    throw err;
  }
};

// Get all Advertisment
const getAllAds = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM "sharEco-schema"."advertisement" ORDER BY "startDate" DESC'
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get all PENDING Advertisment
const getAdsReq = async () => {
  try {
    const result = await pool.query(
      `SELECT COUNT("advertisementId") FROM "sharEco-schema".advertisement 
    WHERE "status" = $1`,
      ["PENDING"]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get all ACTIVE Advertisement
const getActiveAds = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."advertisement" 
      WHERE "status" = $1
      ORDER BY "bidPrice" DESC`,
      ["ACTIVE"]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Increase visit counter
const updateAdVisits = async (adId) => {
  try {
    const currentVisitsResult = await pool.query(
      `SELECT "visits" FROM "sharEco-schema"."advertisement" WHERE "advertisementId" = $1`,
      [adId]
    );
    const currentVisits = currentVisitsResult.rows[0]?.visits;
    console.log(currentVisits);

    if (currentVisits !== undefined) {
      const result = await pool.query(
        `UPDATE "sharEco-schema"."advertisement" 
        SET "visits" = $1
        WHERE "advertisementId" = $2
        RETURNING *`,
        [currentVisits + 1, adId]
      );
      return result.rows[0];
    } else {
      throw new Error("Current visits count is undefined");
    }
  } catch (err) {
    throw err;
  }
};

const updateWeeklyAdsToPast = async () => {
  try {
    // Update ads from "ACTIVE" to "PAST" where status is "ACTIVE"
    const updateActiveAdsToPast = await pool.query(
      `UPDATE "sharEco-schema"."advertisement" 
        SET "status" = 'PAST'
        WHERE "status" = 'ACTIVE'`
    );

    return {
      updatedActiveAds: updateActiveAdsToPast.rowCount,
    };
  } catch (error) {
    throw error;
  }
};

const updateWeeklyAdsToActive = async () => {
  try {
    // Update ads from "APPROVED" to "ACTIVE" where status is "APPROVED"
    const updateApprovedAdsToActive = await pool.query(
      `UPDATE "sharEco-schema"."advertisement" 
        SET "status" = 'ACTIVE'
        WHERE "status" = 'APPROVED'`
    );

    return {
      updatedApprovedAds: updateApprovedAdsToActive.rowCount,
    };
  } catch (error) {
    throw error;
  }
};

const updateWeeklyAds = async () => {
  try {
    const resultToPast = await updateWeeklyAdsToPast();
    const resultToActive = await updateWeeklyAdsToActive();

    return {
      ...resultToPast,
      ...resultToActive,
    };
  } catch (error) {
    throw error;
  }
};

const updateAdsStatus = async (newStatus, advertismentId) => {
  try {
    // Update ads from "APPROVED" to "ACTIVE" where status is "APPROVED"
    const result = await pool.query(
      `UPDATE "sharEco-schema"."advertisement" 
        SET "status" = $1 WHERE "advertisementId" = $2 RETURNING *`,
      [newStatus, advertismentId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
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
  rankWeekAds,
  getAdsReq,
  getActiveAds,
  updateAdVisits,
  getAllAds,
  updateWeeklyAdsToPast,
  updateWeeklyAdsToActive,
  updateWeeklyAds,
  updateAdsStatus,
  getAllWeeklyAds,
};
