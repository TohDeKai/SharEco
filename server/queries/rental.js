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

const getAvailByRentalIdAndDate = async (itemId, date) => {
  try {
    // Convert date string to a Date object
    const currentDate = new Date(date);

    const result = await pool.query(
      `SELECT "startDate", "endDate" FROM "sharEco-schema"."rental"
       WHERE "itemId" = $1
         AND (("startDate"::date = $2 OR "endDate"::date = $2 + interval '1 day')
         OR ("startDate" > $2 AND "endDate" > $2))`,
      [itemId, date]
    );

    // Process the result to generate a list of available time intervals
    const bookings = result.rows;
    const unavail = [];
    const singaporeTimeZone = 'Asia/Singapore';

    // Process each booking to create intervals
    for (const booking of bookings) {
      const bookingStart = new Date(
        new Date(booking.startDate).toLocaleString("en-US", {
          timeZone: singaporeTimeZone,
        })
      );
      const bookingEnd = new Date(
        new Date(booking.endDate).toLocaleString("en-US", {
          timeZone: singaporeTimeZone,
        })
      );
      const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

      if (bookingStart && bookingEnd) {
        if (bookingStart < currentDate) {
          if (
            bookingEnd.getDate() == currentDate.getDate() ||
            bookingEnd.getDate() == nextDay.getDate()
          ) {
            unavail.push({
              start: currentDate.toLocaleString(),
              end: bookingEnd.toLocaleString(),
            });
          } else {
            const endOfDay = new Date(nextDay);
            endOfDay.setHours(23, 30, 0, 0);
            const endOfDaySingapore = endOfDay.toLocaleString('en-US', { timeZone: singaporeTimeZone });
            unavail.push({
              start: currentDate.toLocaleString(),
              end: endOfDaySingapore,
            });
          }
        ),
        end: new Date(currentDate.setHours(23, 59, 0, 0)).toLocaleString(
          "en-GB",
          {
            timeZone: singaporeTimeZone,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      });
    } else {
      //Previous time is at the start of the day
      let nextStart = new Date(currentDate.setHours(0, 0, 0, 0)).toLocaleString("en-GB", {
        timeZone: singaporeTimeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      for (const slot of unavail) {
        //First booking starts at 12AM
        if (
          slot == unavail[0] &&
          slot.start.toString == nextStart.toString
        ) {
          console.log("First start 12am");
          nextStart = slot.end;
          if (slot == unavail[unavail.length - 1]) {
            if (
              slot.end !=
              new Date(currentDate.setHours(23, 59, 0, 0)).toLocaleString(
                "en-GB",
                {
                  timeZone: singaporeTimeZone,
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            ) {
              //Add to end
              intervals.push({
                start: slot.end.toLocaleString("en-GB", {
                  timeZone: singaporeTimeZone,
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                end: new Date(currentDate.setHours(23, 59, 0, 0)).toLocaleString(
                  "en-GB",
                  {
                    timeZone: singaporeTimeZone,
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
              });
            }
            //Everything else
          } 
        } else if (slot == unavail[unavail.length - 1]) {
          console.log("last unavailable");
          //Add to front
          intervals.push({
            start: nextStart.toLocaleString("en-GB", {
              timeZone: singaporeTimeZone,
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            end: slot.start.toLocaleString("en-GB", {
              timeZone: singaporeTimeZone,
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
          if (
            bookingEnd.getDate() == currentDate.getDate() ||
            bookingEnd.getDate() == nextDay.getDate()
          ) {
            unavail.push({
              start: bookingStart.toLocaleString(), //smth is wrong here it shows 8AM instead of booking start time
              end: bookingEnd.toLocaleString(),
            });
          } else {
            const endOfDay = new Date(nextDay);
            endOfDay.setHours(23, 30, 0, 0);
            const endOfDaySingapore = endOfDay.toLocaleString('en-US', { timeZone: singaporeTimeZone });
            unavail.push({
              start: bookingStart.toLocaleString(),
              end: endOfDaySingapore,
            });
          }
        } else if (bookingStart.getDate() == nextDay.getDate()) {
          if (bookingEnd.getDate() == nextDay.getDate()) {
            unavail.push({
              start: bookingStart.toLocaleString(),
              end: bookingEnd.toLocaleString(),
            });
          } else {
            const endOfDay = new Date(nextDay);
            endOfDay.setHours(23, 30, 0, 0);
            const endOfDaySingapore = endOfDay.toLocaleString('en-US', { timeZone: singaporeTimeZone });
              unavail.push({
                start: bookingStart.toLocaleString(),
                end: endOfDaySingapore,
              });
          }
        }
      }
    }

    return unavail;
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
  getAvailByRentalIdAndDate,
};