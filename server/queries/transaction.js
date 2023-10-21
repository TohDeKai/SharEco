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

  // const transactionToAdmin = async (senderId, amount, transactionType) => {
  //   try {      
  //   //   const getAdminWalletBalance = await pool.query(
  //   //     `SELECT "walletBalance" FROM "sharEco-schema"."user" 
  //   // WHERE "userId" = 1`,
  //   //   )
      
  //   //   const updatedAdminWalletBalance = parseFloat(getAdminWalletBalance.rows[0].replace("$", "")) + amount;

  //   //   const result = await pool.query(
  //   //     `INSERT INTO "sharEco-schema"."transaction" 
  //   //           ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
  //   //             values ($1, $2, $3, $4, $5) returning *`,
  //   //     [
  //   //       currentTimeStamp,
  //   //       senderId,
  //   //       1,
  //   //       amount,
  //   //       transactionType,
  //   //     ]
  //   //   );

  //   const result = await pool.query(
  //     `WITH new_transaction AS (
  //       INSERT INTO "sharEco-schema"."transaction" 
  //         ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
  //       VALUES ($1, $2, $3, $4, $5)
  //       RETURNING *
  //     )
  //     UPDATE "sharEco-schema.user" AS sender
  //     SET "walletBalance" = sender."walletBalance" - $4
  //     FROM "sharEco-schema.user" AS receiver
  //     WHERE sender."userId" = $2 AND receiver."userId" = $3
  //     SET receiver."walletBalance" = receiver."walletBalance" + $4
  //     RETURNING new_transaction.*, sender."walletBalance" AS sender_wallet_balance, receiver."walletBalance" AS receiver_wallet_balance`,
  //     [
  //       currentTimeStamp,
  //       senderId,
  //       1, // Specify the actual receiver's userId
  //       amount,
  //       transactionType,
  //     ]
  //   );
  //     return result.rows[0];
  //   } catch (err) {
  //     throw err;
  //   }
  // };
  const transactionToAdmin = async (senderId, amount, transactionType) => {
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        // Insert the transaction
        const insertTransactionQuery = `INSERT INTO "sharEco-schema"."transaction" 
          ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
          values ($1, $2, $3, $4, $5) returning *`;
        const result = await client.query(insertTransactionQuery, [
          currentTimeStamp,
          senderId,
          1, // Specify the actual receiver's userId
          amount,
          transactionType,
        ]);
  
        // Update sender's walletBalance
        const updateSenderQuery = `UPDATE "sharEco-schema"."user"
          SET "walletBalance" = "walletBalance" - $1
          WHERE "userId" = $2
          RETURNING "walletBalance"`;
        const senderWalletBalance = await client.query(updateSenderQuery, [
          amount,
          senderId,
        ]);
  
        // Update receiver's walletBalance
        const updateReceiverQuery = `UPDATE "sharEco-schema"."user"
          SET "walletBalance" = "walletBalance" + $1
          WHERE "userId" = $2
          RETURNING "walletBalance"`;
        const receiverWalletBalance = await client.query(updateReceiverQuery, [
          amount,
          1, 
        ]);
  
        await client.query('COMMIT');
        return {
          transaction: result.rows[0],
          sender_wallet_balance: senderWalletBalance.rows[0].walletBalance,
          receiver_wallet_balance: receiverWalletBalance.rows[0].walletBalance,
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      throw err;
    }
  };

  const transactionFromAdmin = async (receiverId, amount, transactionType) => {
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        // Insert the transaction
        const insertTransactionQuery = `INSERT INTO "sharEco-schema"."transaction" 
          ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
          values ($1, $2, $3, $4, $5) returning *`;
        const result = await client.query(insertTransactionQuery, [
          currentTimeStamp,
          1,
          receiverId,
          amount,
          transactionType,
        ]);
  
        // Update sender's walletBalance
        const updateSenderQuery = `UPDATE "sharEco-schema"."user"
          SET "walletBalance" = "walletBalance" - $1
          WHERE "userId" = $2
          RETURNING "walletBalance"`;
        const senderWalletBalance = await client.query(updateSenderQuery, [
          amount,
          1,
        ]);
  
        // Update receiver's walletBalance
        const updateReceiverQuery = `UPDATE "sharEco-schema"."user"
          SET "walletBalance" = "walletBalance" + $1
          WHERE "userId" = $2
          RETURNING "walletBalance"`;
        const receiverWalletBalance = await client.query(updateReceiverQuery, [
          amount,
          receiverId, 
        ]);
  
        await client.query('COMMIT');
        return {
          transaction: result.rows[0],
          sender_wallet_balance: senderWalletBalance.rows[0].walletBalance,
          receiver_wallet_balance: receiverWalletBalance.rows[0].walletBalance,
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      throw err;
    }
  };

  // get transaction as receiver
const getTransactionsByReceiverId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."transaction" 
    WHERE "receiverId" = $1`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

  // get transaction as receiver
  const getTransactionsBySenderId = async (userId) => {
    try {
      const result = await pool.query(
        `SELECT * FROM "sharEco-schema"."transaction" 
      WHERE "senderId" = $1`,
        [userId]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  };
  
  module.exports = {
      createTransaction,
      getTransactionsByReceiverId,
      getTransactionsBySenderId,
      transactionToAdmin,
      transactionFromAdmin
  };