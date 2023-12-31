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

// Create Transaction (No wallet balance updated)
const createTransaction = async (
  senderId,
  receiverId,
  amount,
  transactionType
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."transaction" 
              ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
                values ($1, $2, $3, $4, $5) returning *`,
      [new Date(), senderId, receiverId, amount, transactionType]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Create Withdrawal Request (no wallet balance updated)
const createWithdrawalRequest = async (senderId, amount) => {
  try {

    const result = transactionToAdmin(senderId, amount, "WITHDRAW");
    // const result = await pool.query(
    //   `INSERT INTO "sharEco-schema"."transaction" 
    //         ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
    //           values ($1, $2, $3, $4, $5) returning *`,
    //   [new Date(), senderId, 1, amount, "WITHDRAW"]
    // );
    return result;
  } catch (err) {
    throw err;
  }
};

// Approve withdrawal request (update wallet balances)
const approveWithdrawalRequest = async (transactionId, referenceNumber) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Retrieve the transaction
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."transaction" 
    WHERE "transactionId" = $1`,
      [transactionId]
    );

    const transaction = result.rows[0];
    const senderId = transaction.senderId;
    const receiverId = transaction.receiverId;
    const amount = parseFloat(transaction.amount.replace("$", ""));

    const receiverResult = await client.query(
      'SELECT "userId", "walletBalance" FROM "sharEco-schema"."user" WHERE "userId" = $1',
      [receiverId]
    );

    if (receiverResult.rows.length === 0) {
      throw new Error("Receiver user not found");
    }

    // const updatedSenderResult = await client.query(
    //   `UPDATE "sharEco-schema"."user"
    // SET "walletBalance" = ($1 + "walletBalance")
    // WHERE "userId" = $2
    // RETURNING "walletBalance"`,
    //   [-amount, senderId]
    // );

    // platform withdrawal fees of 5% added to admin wallet (capped at $10)
    const withdrawalFees = Math.min(10, 0.05 * amount);
    const amountWithdrawnAfterFees = amount - withdrawalFees;

    const updatedReceiverResult = await client.query(
      `UPDATE "sharEco-schema"."user"
    SET "walletBalance" = ("walletBalance" - $1)
    WHERE "userId" = $2
    RETURNING "walletBalance"`,
      [amountWithdrawnAfterFees, receiverId]
    );

    const updatedTransactionResult = await client.query(
      `UPDATE "sharEco-schema"."transaction"
    SET "referenceNumber" = $1
    WHERE "transactionId" = $2`,
      [referenceNumber, transactionId]
    );

    await client.query("COMMIT");

    return {
      transaction: result.rows[0],
      //sender_wallet_balance: updatedSenderResult.rows[0].walletBalance,
      receiver_wallet_balance: updatedReceiverResult.rows[0].walletBalance,
      reference_number: updatedTransactionResult.rows[0],
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

//Transfer from one user to another based on username (wallet balance updated)
const transferBetweenUsers = async (
  senderUsername,
  receiverUsername,
  amount
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const senderQuery =
      'SELECT "userId", "walletBalance" FROM "sharEco-schema"."user" WHERE "username" = $1';
    const senderResult = await client.query(senderQuery, [senderUsername]);

    if (senderResult.rows.length === 0) {
      throw new Error("Sender user not found");
    }

    const sender = senderResult.rows[0];
    const senderId = sender.userId;
    const senderWalletBalance = parseFloat(
      sender.walletBalance.replace("$", "")
    );

    const receiverQuery =
      'SELECT "userId", "walletBalance" FROM "sharEco-schema"."user" WHERE "username" = $1';
    const receiverResult = await client.query(receiverQuery, [
      receiverUsername,
    ]);

    if (receiverResult.rows.length === 0) {
      throw new Error("Receiver user not found");
    }

    const receiver = receiverResult.rows[0];
    const receiverId = receiver.userId;
    const receiverWalletBalance = parseFloat(
      receiver.walletBalance.replace("$", "")
    );

    const insertTransactionQuery = `INSERT INTO "sharEco-schema"."transaction" 
        ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
        values ($1, $2, $3, $4, $5) returning *`;
    const transactionResult = await client.query(insertTransactionQuery, [
      new Date(),
      senderId,
      receiverId,
      amount,
      "TRANSFER",
    ]);

    const updateSenderQuery = `UPDATE "sharEco-schema"."user"
        SET "walletBalance" = ($1 + "walletBalance")
        WHERE "userId" = $2
        RETURNING "walletBalance"`;
    const updatedSenderResult = await client.query(updateSenderQuery, [
      -amount,
      senderId,
    ]);

    const updateReceiverQuery = `UPDATE "sharEco-schema"."user"
        SET "walletBalance" = ($1 + "walletBalance")
        WHERE "userId" = $2
        RETURNING "walletBalance"`;
    const updatedReceiverResult = await client.query(updateReceiverQuery, [
      amount,
      receiverId,
    ]);

    await client.query("COMMIT");

    return {
      transaction: transactionResult.rows[0],
      sender_wallet_balance: updatedSenderResult.rows[0].walletBalance,
      receiver_wallet_balance: updatedReceiverResult.rows[0].walletBalance,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

//Transfer from one user to admin (wallet balance updated)
const transactionToAdmin = async (senderId, amount, transactionType) => {
  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertTransactionQuery = `INSERT INTO "sharEco-schema"."transaction" 
          ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
          values ($1, $2, $3, $4, $5) returning *`;
      const result = await client.query(insertTransactionQuery, [
        new Date(),
        senderId,
        1,
        amount,
        transactionType,
      ]);

      const updateSenderQuery = `UPDATE "sharEco-schema"."user"
          SET "walletBalance" = "walletBalance" - $1
          WHERE "userId" = $2
          RETURNING "walletBalance"`;
      const senderWalletBalance = await client.query(updateSenderQuery, [
        amount,
        senderId,
      ]);

      const updateReceiverQuery = `UPDATE "sharEco-schema"."user"
          SET "walletBalance" = "walletBalance" + $1
          WHERE "userId" = $2
          RETURNING "walletBalance"`;
      const receiverWalletBalance = await client.query(updateReceiverQuery, [
        amount,
        1,
      ]);

      await client.query("COMMIT");
      return {
        transaction: result.rows[0],
        sender_wallet_balance: senderWalletBalance.rows[0].walletBalance,
        receiver_wallet_balance: receiverWalletBalance.rows[0].walletBalance,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    throw err;
  }
};

//Transfer from admin to one user (wallet balance updated)
const transactionFromAdmin = async (receiverId, amount, transactionType) => {
  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertTransactionQuery = `INSERT INTO "sharEco-schema"."transaction" 
          ("transactionDate", "senderId", "receiverId", "amount", "transactionType") 
          values ($1, $2, $3, $4, $5) returning *`;
      const result = await client.query(insertTransactionQuery, [
        new Date(),
        1,
        receiverId,
        amount,
        transactionType,
      ]);

      const updateSenderQuery = `UPDATE "sharEco-schema"."user"
          SET "walletBalance" = "walletBalance" - $1
          WHERE "userId" = $2
          RETURNING "walletBalance"`;
      const senderWalletBalance = await client.query(updateSenderQuery, [
        amount,
        1,
      ]);

      const updateReceiverQuery = `UPDATE "sharEco-schema"."user"
          SET "walletBalance" = "walletBalance" + $1
          WHERE "userId" = $2
          RETURNING "walletBalance"`;
      const receiverWalletBalance = await client.query(updateReceiverQuery, [
        amount,
        receiverId,
      ]);

      await client.query("COMMIT");
      return {
        transaction: result.rows[0],
        sender_wallet_balance: senderWalletBalance.rows[0].walletBalance,
        receiver_wallet_balance: receiverWalletBalance.rows[0].walletBalance,
      };
    } catch (err) {
      await client.query("ROLLBACK");
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

// get transaction by type
const getTransactionsByType = async (type) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."transaction" 
      WHERE "transactionType" = $1`,
      [type]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getRentalEarningsByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT t.*
      FROM "sharEco-schema"."transaction" t
      WHERE "transactionType" = 'RENTAL_INCOME' AND "receiverId" = $1`,
      [userId]
    );
    if (result.rows.length > 0) {
      return result.rows;
    } else {
      // If no rows found, return "$0"
      return [{ userId, totalEarnings: "$0" }];
    }
  } catch (err) {
    throw err;
  }
}

const getRevenueData = async () => {
  try {
    const result = await pool.query(`
      SELECT
        SUM(CASE WHEN "transactionType" = 'RENTAL_PAYMENT' THEN ("amount"::numeric) ELSE 0 END) -
        SUM(CASE WHEN "transactionType" IN ('CANCELLATION_REFUND') THEN ("amount"::numeric) ELSE 0 END) AS revenue,
        SUM(CASE WHEN "transactionType" = 'ADS' THEN ("amount"::numeric) ELSE 0 END) AS ads,
        SUM(CASE WHEN "transactionType" = 'SPOTLIGHT' THEN ("amount"::numeric) ELSE 0 END) AS spotlight
      FROM "sharEco-schema"."transaction"
    `);

    const revenue = result.rows[0].revenue;
    const ads = result.rows[0].ads;
    const spotlight = result.rows[0].spotlight;

    return {
      revenue,
      ads,
      spotlight,
    };
  } catch (err) {
    throw err;
  }
};

const getPastWeeksRevenue = async () => {
  try {
    const result = await pool.query(`
      SELECT
        to_char(date_trunc('day', time_series.day), 'YYYY-MM-DD') AS transactionday,
        COALESCE(SUM(CASE WHEN t."receiverId" = 1 AND t."transactionType" != 'WITHDRAW' THEN (t."amount"::numeric) ELSE 0 END), 0) AS revenue
      FROM
        generate_series(current_date - interval '6 days', current_date, '1 day') as time_series(day)
      LEFT JOIN
        "sharEco-schema"."transaction" t
      ON
        to_char(date_trunc('day', t."transactionDate"), 'YYYY-MM-DD') = to_char(date_trunc('day', time_series.day), 'YYYY-MM-DD')
      GROUP BY
        time_series.day
      ORDER BY
        time_series.day;
    `);

    return {
      status: 'success',
      data: {
        revenue: result.rows,
      },
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createTransaction,
  getTransactionsByReceiverId,
  getTransactionsBySenderId,
  transactionToAdmin,
  transactionFromAdmin,
  transferBetweenUsers,
  createWithdrawalRequest,
  approveWithdrawalRequest,
  getTransactionsByType,
  getRentalEarningsByUserId,
  getRevenueData,
  getPastWeeksRevenue
};
