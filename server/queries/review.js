const Pool = require("pg").Pool;
const moment = require("moment");

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

const currentTimeStamp = moment().format("YYYY-MM-DD HH:mm:ss");

// Create Review
const createReview = async (
  rating,
  comments,
  revieweeIsLender,
  reviewerId,
  revieweeId,
  rentalId
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."review" ("rating", "comments", "reviewDate", "revieweeIsLender", "reviewerId", "revieweeId", "rentalId") values ($1, $2, $3, $4, $5, $6, $7) returning *`,
      [
        rating,
        comments,
        currentTimeStamp,
        revieweeIsLender,
        reviewerId,
        revieweeId,
        rentalId,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Edit Review
// const editReview = async () => {
//   try {
//   } catch (error) {
//     throw error;
//   }
// };

// Delete Review
const deleteReview = async (reviewId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."review" 
        WHERE "rentalId" = $1
        RETURNING *`,
      [reviewId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get All Reviews
const getAllReviews = async () => {
  try {
    const result = await pool.query(`SELECT * FROM "sharEco-schema"."review"`);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

//Get Review by  ReviewId
const getReviewByReviewId = async (reviewId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."review" 
            WHERE "reviewId" = $1`,
      [reviewId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getReviewsByRevieweeId = async (revieweeId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."review" 
        WHERE "revieweeId" = $1`,
      [revieweeId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewByReviewId,
  getReviewsByRevieweeId,
};
