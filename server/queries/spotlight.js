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

// Create Spotlight
const createSpotlight = async (duration, price, itemId) => {
  try {
    const durationMap = {
        "6 hours": 6,
        "12 hours": 12,
        "1 day": 24,
        "3 days": 24 * 3,
        "1 week": 24 * 7,
      };
    
      const hours = durationMap[duration];
      var endDate = currentTimeStamp;
      if (typeof hours !== 'undefined') {
        endDate = new Date(new Date(currentTimeStamp).getTime() + hours * 60 * 60 * 1000);
      }
    
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."spotlight" 
            ("startDate", "endDate", "duration", "price", "itemId") 
              values ($1, $2, $3, $4, $5) returning *`,
      [
        currentTimeStamp,
        endDate,
        duration,
        price,
        itemId,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
    createSpotlight,
};
