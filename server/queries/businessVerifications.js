const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Get all business verifications
const getBusinessVerifications = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM "sharEco-schema"."businessVerification"'
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Get business verification based on business verification ID
const getBusinessVerificationById = async (businessVerificationId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "sharEco-schema"."businessVerification" WHERE "businessVerificationId" = $1',
      [businessVerificationId]
    );
    return result.rows[0]; // Assuming there's only one matching record
  } catch (err) {
    throw err;
  }
};
//get business verification by businessVerificationId
const getBusinessVerificationByBusinessVerificationId = async (
  businessVerificationId
) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."businessVerification" 
      WHERE "businessVerificationId" = $1`,
      [businessVerificationId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Get total number of business verification request
const getTotalBusinessVerificationRequest = async () => {
  try {
    const result = await pool.query(
      `SELECT COUNT("businessVerificationId") FROM "sharEco-schema"."businessVerification"
    WHERE "approved" = $1`,
      [false]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Create new business verification
const createBusinessVerification = async (
  UEN,
  documents,
  approved,
  originalUserId
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."businessVerification" 
        ("UEN", documents, approved, "originalUserId") values ($1, $2, $3, $4) returning *`,
      [UEN, documents, approved, originalUserId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update business verification
const updateBusinessVerification = async (
  businessVerificationId,
  UEN,
  documents,
  approved,
  originalUserId
) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."businessVerification" 
        SET "UEN" = $1, 
        documents = $2,
        approved = $3,
        "originalUserId" = $4
        WHERE "businessVerificationId" = $5
        RETURNING *`,
      [UEN, documents, approved, originalUserId, businessVerificationId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update documents for a business verification
const updateDocumentsForBusinessVerification = async (
  businessVerificationId,
  files
) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."businessVerification" 
        SET documents = $1
        WHERE "businessVerificationId" = $2
        RETURNING documents`,
      [files, businessVerificationId]
    );

    if (result.rows.length > 0) {
      return result.rows[0].documents;
    } else {
      return null; // Return null if the item is not found or the update fails
    }
  } catch (err) {
    throw err;
  }
};

// Delete business verification
const deleteBusinessVerification = async (businessVerificationId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."businessVerification" 
        WHERE "businessVerificationId" = $1
        RETURNING *`,
      [businessVerificationId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getBusinessVerifications,
  getBusinessVerificationById,
  getBusinessVerificationByBusinessVerificationId,
  createBusinessVerification,
  updateBusinessVerification,
  updateDocumentsForBusinessVerification,
  deleteBusinessVerification,
  getTotalBusinessVerificationRequest,
};
