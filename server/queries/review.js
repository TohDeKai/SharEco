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

//Get Reviews by RevieweeId
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

//Get Reviews by RevieweeId
const getReviewsByReviewerId = async (reviewerId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."review" 
        WHERE "reviewerId" = $1`,
      [reviewerId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
}

//Gets star rating by userId
const getRatingByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT "rating" FROM "sharEco-schema"."review" 
        WHERE "revieweeId" = $1`,
      [userId]
    );

    //THIS DOESNT WORK FOR SOME REASON
    if (!result || result.rows.length === 0) {
      // Handle the case when there are no reviews
      return { averageRating: 0, numberOfRatings: 0 };
    }

    const totalRating = result.rows.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / result.rowCount; 
    return { averageRating, numberOfRatings: result.rowCount};

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
  getRatingByUserId,
  getReviewsByReviewerId,
};
