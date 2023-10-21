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

// Create Transaction
const createTransaction = async (senderId, receiverId, amount, transactionType) => {
    try {      
      const result = await pool.query(
        `INSERT INTO "sharEco-schema"."transaction" 
              ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
                values ($1, $2, $3, $4, $5) returning *`,
        [
          currentTimeStamp,
          senderId,
          receiverId,
          amount,
          transactionType,
        ]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  };
  
  module.exports = {
      createTransaction,
  };