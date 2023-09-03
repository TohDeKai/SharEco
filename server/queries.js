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

//Get a user
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
const updateUser = (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.status(200).json({
    status: "success",
    data: {
      user: "User 1",
    },
  });
};

//Delete user
const deleteUser = (req, res) => {
  res.status(204).json({
    status: "success",
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
