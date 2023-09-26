const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Create Rental
const createRentalRequest = async (
  startDate,
  endDate,
  collectionLocation,
  additionalRequest,
  depositFee,
  rentalFee,
  itemId,
  borrowerId,
  lenderId
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."rental" 
          ("startDate", "endDate", "collectionLocation", "status", "additionalRequest", "additionalCharges", "depositFee", "rentalFee", "itemId", "borrowerId", "lenderId") 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
      [
        startDate,
        endDate,
        collectionLocation,
        "PENDING",
        additionalRequest,
        0,
        depositFee,
        rentalFee,
        itemId,
        borrowerId,
        lenderId,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Edit Rental
const editRentalRequest = async (
  rentalId,
  startDate,
  endDate,
  collectionLocation,
  additionalRequest,
  additionalCharges,
  depositFee,
  rentalFee
) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."rental" 
          SET "startDate" = $1, 
          "endDate" = $2,
          "collectionLocation" = $3,
          "additionalRequest" = $4,
          "additionalCharges" = $5,
          "depositFee" = $6,
          "rentalFee" = $7
          WHERE "rentalId" = $8
          RETURNING *`,
      [
        startDate,
        endDate,
        collectionLocation,
        additionalRequest,
        additionalCharges,
        depositFee,
        rentalFee,
        rentalId,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

//Update Rental Status Yet to do in server
const updateRentalStatus = async (status, rentalId) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."rental" 
          SET "status" = $1
          WHERE "rentalId" = $2
          RETURNING *`,
      [status, rentalId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Delete Rental Request
const deleteRentalRequest = async (rentalId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."rental" 
        WHERE "rentalId" = $1
        RETURNING *`,
      [rentalId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

//Get all rentals
const getAllRentals = async () => {
  try {
    const result = await pool.query(`SELECT * FROM "sharEco-schema"."rental"`);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get Rental by Lender Id
const getRentalsByLenderId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."rental" 
            WHERE "lenderId" = $1`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get Rental by Borrower Id
const getRentalsByBorrowerId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."rental" 
            WHERE "borrowerId" = $1`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get Rental by Item Id
const getRentalsByItemId = async (itemId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."rental" 
              WHERE "itemId" = $1`,
      [itemId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get rental by rental Id
const getRentalByRentalId = async (rentalId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."rental" 
          WHERE "rentalId" = $1`,
      [rentalId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createRentalRequest,
  editRentalRequest,
  updateRentalStatus, //not done in server.js
  deleteRentalRequest,
  getAllRentals,
  getRentalsByLenderId,
  getRentalsByBorrowerId,
  getRentalsByItemId,
  getRentalByRentalId,
};
