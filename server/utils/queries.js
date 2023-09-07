const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

//Get all users
const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "sharEco-schema"."account"');
    console.log(result);

    res.status(200).json({
      status: "success",
      results: result.rows.length,
      data: {
        users: result.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//Get a user by ID
const getUserById = async (req, res) => {
  console.log("Getting user with userId: " + req.params.userId);

  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."account" 
    WHERE "accountId" = $1`,
      [req.params.userId]
    );

    res.status(200).json({
      status: "success",
      data: {
        user: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//Get a user by username
const getUserByUsername = async (req, res) => {
  console.log("Getting user with username: " + req.params.username);

  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."account" 
    WHERE username = $1`,
      [req.params.username]
    );

    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

//Create a user
const createUser = async (req, res) => {
  console.log(req.body);

  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."account" 
    (username, password) values ($1, $2) returning *`,
      [req.body.username, req.body.password]
    );
    console.log(result);

    res.status(201).json({
      status: "success",
      data: {
        user: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//Update user
const updateUser = async (req, res) => {
  console.log("Updating user with userId: " + req.params.userId);

  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."account" 
      SET username = $1, 
      password = $2 
      WHERE "accountId" = $3
        RETURNING *`,
      [req.body.username, req.body.password, req.params.userId]
    );
    console.log(result);

    res.status(200).json({
      status: "success",
      data: {
        user: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//Delete user
const deleteUser = async (req, res) => {
  console.log("Deleting user with userId: " + req.params.userId);
  try {
    const result = await pool.query(
      `
    DELETE FROM "sharEco-schema"."account" 
    WHERE "accountId" = $1
    RETURNING *`,
      [req.params.userId]
    );

    console.log(result);

    res.status(200).json({
      status: "success",
      data: {
        user: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername,
};
