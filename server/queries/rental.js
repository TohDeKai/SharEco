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
          ("startDate", "endDate", "collectionLocation", "status", "additionalRequest", "additionalCharges", "depositFee", "rentalFee", "itemId", "borrowerId", "lenderId", "creationDate") 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *`,
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
        new Date(),
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

//Get availabilities by rental ID and selected date
const getAvailByRentalIdAndDate = async (itemId, date) => {
  try {
    // Convert date string to a Date object
    const currentDate = new Date(date);

    const result = await pool.query(
      `SELECT "startDate", "endDate" FROM "sharEco-schema"."rental"
       WHERE "itemId" = $1
         AND ("startDate"::date = $2 OR "endDate"::date = $2 OR ("startDate"::date < $2 AND "endDate"::date > $2))
         AND (("status" = 'PENDING' OR "status" = 'UPCOMING' OR "status" = 'ONGOING'))`,
      [itemId, date]
    );

    // Process the result to generate a list of available time intervals
    const bookings = result.rows;
    const unavail = [];
    const intervals = [];
    const singaporeTimeZone = "Asia/Singapore";

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
      console.log(bookingStart);
      console.log(bookingEnd);
      const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      //booking starts and ends on selected date
      if (
        bookingStart.getDate() == currentDate.getDate() &&
        bookingEnd.getDate() == currentDate.getDate()
      ) {
        unavail.push({
          start: bookingStart.toLocaleString("en-GB", {
            timeZone: singaporeTimeZone,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          end: bookingEnd.toLocaleString("en-GB", {
            timeZone: singaporeTimeZone,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        console.log("booking starts and ends on selected date");
      }
      //booking starts before selected date but ends on selected date -> unavailable starts midnight of selected date and ends when bookingEnd
      else if (
        bookingStart < currentDate &&
        bookingEnd.getDate() == currentDate.getDate()
      ) {
        unavail.push({
          start: new Date(currentDate.setHours(0, 0, 0, 0)).toLocaleString(
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
          end: bookingEnd.toLocaleString("en-GB", {
            timeZone: singaporeTimeZone,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        console.log("booking starts before selected and ends on selected date");
      }

      //booking starts on selected and ends after selected date
      else if (
        bookingStart.getDate() == currentDate.getDate() &&
        bookingEnd > currentDate
      ) {
        unavail.push({
          start: bookingStart.toLocaleString("en-GB", {
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
        console.log("booking starts on selected and ends after selected date");

        //booking starts before selected and ends after selected date
      } else if (
        bookingStart.getDate() < currentDate.getDate() &&
        bookingEnd.getDate() > currentDate.getDate()
      ) {
        unavail.push({
          start: new Date(currentDate.setHours(0, 0, 0, 0)).toLocaleString(
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
        console.log(
          "booking starts before selected and ends after selected date"
        );
      }
    }
    // Calculate availabilities
    if (unavail.length === 0) {
      console.log("Unavail length 0");
      // If there are no bookings, the entire day is available
      intervals.push({
        start: new Date(currentDate.setHours(0, 0, 0, 0)).toLocaleString(
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
      let nextStart = new Date(currentDate.setHours(0, 0, 0, 0)).toLocaleString(
        "en-GB",
        {
          timeZone: singaporeTimeZone,
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      for (const slot of unavail) {
        //First booking starts at 12AM
        if (slot == unavail[0] && slot.start == nextStart) {
          console.log(slot.start);
          console.log(nextStart);
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
                end: new Date(
                  currentDate.setHours(23, 59, 0, 0)
                ).toLocaleString("en-GB", {
                  timeZone: singaporeTimeZone,
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
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
        } else {
          console.log("other cases");
          intervals.push({
            start: nextStart.toLocaleString("en-GB", {
              timeZone: singaporeTimeZone,
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            end: new Date(slot.start).toLocaleString("en-GB", {
              timeZone: singaporeTimeZone,
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
          nextStart = slot.end;
        }
      }
    }

    return intervals;
  } catch (err) {
    throw err;
  }
};

//Get unavailability for daily bookings
const getDailyUnavailability = async (itemId) => {
  try {
    const date = new Date();
    const maxDate = new Date();
    maxDate.setMonth(date.getMonth() + 5);
    const result = await pool.query(
      `SELECT "startDate", "endDate"
       FROM "sharEco-schema"."rental"
       WHERE "itemId" = $1
         AND (("startDate"::date BETWEEN $2 AND $3) OR
           ("endDate"::date BETWEEN $2 AND $3))
         AND ("status" IN ('PENDING', 'UPCOMING', 'ONGOING'))`,
      [itemId, date, maxDate]
    );

    const bookings = result.rows;
    const unavail = [];
    const singaporeTimeZone = "Asia/Singapore";
    const nineAM = new Date(new Date().setHours(9, 0, 0, 0));

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

      // If booking starts and ends on the same day after 9AM
      if (
        bookingStart.getDate == bookingEnd.getDate &&
        bookingEnd.getTime() < nineAM
      ) {
        unavail.push(
          bookingStart.getDate().toLocaleString("en-US", {
            timeZone: singaporeTimeZone,
          })
        );
        console.log("Same day booking ends after 9AM");
      }

      // If booking ends before 9AM
      else {
        let currentDate = bookingStart;
        while (currentDate < bookingEnd) {
          console.log("Logging for ", currentDate);
          unavail.push(
            new Date(currentDate).toLocaleString("en-US", {
              timeZone: singaporeTimeZone,
            })
          );
          currentDate
            .setDate(currentDate.getDate() + 1)
            .toLocaleString("en-US", { timeZone: singaporeTimeZone });
        }
        if (bookingEnd.getTime() < nineAM) {
          unavail.push(
            new Date(currentDate).toLocaleString("en-US", {
              timeZone: singaporeTimeZone,
            })
          );
        }
      }
    }
    return unavail;
  } catch (err) {
    throw err;
  }
};

const getFullDayUnavailability = async (itemId) => {
  try {
    const date = new Date();
    const maxDate = new Date();
    maxDate.setMonth(date.getMonth() + 5);
    const result = await pool.query(
      `SELECT "startDate", "endDate"
       FROM "sharEco-schema"."rental"
       WHERE "itemId" = $1
         AND (("startDate"::date BETWEEN $2 AND $3) OR
           ("endDate"::date BETWEEN $2 AND $3))
         AND ("status" IN ('PENDING', 'UPCOMING', 'ONGOING'))`,
      [itemId, date, maxDate]
    );

    const bookings = result.rows;
    const unavail = [];
    const fullDay = [];
    const singaporeTimeZone = "Asia/Singapore";

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

      // If booking starts and ends on the same day
      if (
        new Date(bookingStart).setHours(0, 0, 0, 0) ==
        new Date(bookingEnd).setHours(0, 0, 0, 0)
      ) {
        // If full day booked
        if (
          bookingStart == new Date(bookingStart).setHours(0, 0, 0, 0) &&
          bookingEnd == new Date(bookingEnd).setHours(23, 30, 0, 0)
        ) {
          fullDay.push(
            new Date(bookingStart).toLocaleString("en-GB", {
              timeZone: singaporeTimeZone,
            })
          );
        } else {
          unavail.push({
            start: bookingStart,
            end: bookingEnd,
          });
          console.log(
            "Same day booking (added to unavail): ",
            bookingStart.toLocaleString("en-GB", {
              timeZone: singaporeTimeZone,
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            " ",
            bookingEnd.toLocaleString("en-GB", {
              timeZone: singaporeTimeZone,
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      }

      // If booking consists of 2 or more days
      else {
        let currentDate = bookingStart;
        let isStartOfBooking = true;
        while (currentDate <= bookingEnd) {
          // First day of booking
          // If it starts at 00:00, add to fullDay[]
          if (isStartOfBooking) {
            if (
              currentDate.toLocaleString("en-US", {
                timeZone: singaporeTimeZone,
              }) ==
              new Date(
                new Date(currentDate).setHours(0, 0, 0, 0)
              ).toLocaleString("en-US", {
                timeZone: singaporeTimeZone,
              })
            ) {
              fullDay.push(
                new Date(currentDate).toLocaleString("en-US", {
                  timeZone: singaporeTimeZone,
                })
              );
            }
            unavail.push({
              start: bookingStart,
              end: bookingEnd,
            });
            isStartOfBooking = false;
            console.log(
              "Add multiday booking (start & end): ",
              bookingStart.toLocaleString("en-GB", {
                timeZone: singaporeTimeZone,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              " ",
              bookingEnd.toLocaleString("en-GB", {
                timeZone: singaporeTimeZone,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            );

          // Last day of booking
          // If it ends at 23:30 (last slot), add to fullDay[]
          } else if (
            currentDate.setHours(0, 0, 0, 0) == bookingEnd.setHours(0, 0, 0, 0)
          ) {
            if (
              currentDate.toLocaleString("en-US", {
                timeZone: singaporeTimeZone,
              }) ==
              new Date(
                new Date(currentDate).setHours(23, 30, 0, 0)
              ).toLocaleString("en-US", {
                timeZone: singaporeTimeZone,
              })
            ) {
              fullDay.push(
                new Date(currentDate).toLocaleString("en-US", {
                  timeZone: singaporeTimeZone,
                })
              );
            }
          // In between days are fully booked => Add to fullDay[]
          } else {
            console.log("In between days");
            fullDay.push(
              new Date(currentDate).toLocaleString("en-US", {
                timeZone: singaporeTimeZone,
              })
            );
          }
          // Move onto process the next day in booking
          currentDate
            .setDate(currentDate.getDate() + 1)
            .toLocaleString("en-US", { timeZone: singaporeTimeZone });
        }
      }
    }
    console.log(unavail);
    console.log(fullDay);

    const sortedBookings = unavail.sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA - dateB;
    });

    let continueCheck = false;

    // Checking for full days
    for (let i = 0; i < sortedBookings.length - 1; i++) {
      const currentEnd = new Date(sortedBookings[i].end).toLocaleString(
        "en-US",
        {
          timeZone: singaporeTimeZone,
        }
      );
      const nextStart = new Date(sortedBookings[i + 1].start).toLocaleString(
        "en-US",
        {
          timeZone: singaporeTimeZone,
        }
      );
      const nextEnd = new Date(sortedBookings[i + 1].end).toLocaleString(
        "en-US",
        {
          timeZone: singaporeTimeZone,
        }
      );

      console.log("Processing ", currentEnd);

      // Back to back bookings
      if (currentEnd == nextStart) {
        // Booking is till the end of the day
        const endOfDay = new Date(
          new Date(currentEnd).setHours(23, 30, 0, 0)
        ).toLocaleString("en-US", {
          timeZone: singaporeTimeZone,
        });
        console.log("--> Has back to back at", currentEnd);

        // If booking ends at the end of day OR on a day after
        if (
          nextEnd == endOfDay ||
          nextEnd.substring(0, 10) != nextStart.substring(0, 10)
        ) {
          console.log("It's a full day on ", currentEnd);
          fullDay.push(
            currentEnd.toLocaleString("en-US", {
              timeZone: singaporeTimeZone,
            })
          );
          continueCheck = false;
        } else {
          continueCheck = true;
        }
      }
    }

    return fullDay;
  } catch (err) {
    throw err;
  }
};

//Get next booking based on item ID and selected date
const getNextRentalByItemIdAndDate = async (itemId, date) => {
  try {
    const selectedDate = new Date(date);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 5);
    const result = await pool.query(
      `SELECT "startDate", "endDate"
       FROM "sharEco-schema"."rental"
       WHERE "itemId" = $1
         AND (("startDate"::date BETWEEN $2 AND $3) OR
           ("endDate"::date BETWEEN $2 AND $3))
         AND ("status" IN ('PENDING', 'UPCOMING', 'ONGOING'))`,
      [itemId, date, maxDate]
    );

    const bookings = result.rows;
    const singaporeTimeZone = "Asia/Singapore";

    const sortedBookings = bookings.sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA - dateB;
    });

    console.log(sortedBookings);

    for (const booking of sortedBookings) {
      const bookingEnd = new Date(
        new Date(booking.endDate).toLocaleString("en-US", {
          timeZone: singaporeTimeZone,
        })
      );
      const bookingStart = new Date(
        new Date(booking.startDate).toLocaleString("en-US", {
          timeZone: singaporeTimeZone,
        })
      );
      console.log("Processing booking: ", bookingStart, bookingEnd)
      const endOfBooking = new Date(bookingEnd.setHours(0,0,0,0)).toLocaleString("en-US", {
        timeZone: singaporeTimeZone,
      });
      const currentDate = new Date(selectedDate.setHours(0,0,0,0)).toLocaleString("en-US", {
        timeZone: singaporeTimeZone,
      });
      console.log(endOfBooking != currentDate);
      // If the booking does not end on selected date
      if (endOfBooking != currentDate) {
        console.log("Next booking found");
        // Return the latest a rental can be booked until; the start of next booking
        return bookingStart;
      }
    }
    return maxDate;
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
  getDailyUnavailability,
  getFullDayUnavailability,
  getNextRentalByItemIdAndDate,
};
