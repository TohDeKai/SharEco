require("dotenv").config();
const { application } = require("express");
const express = require("express");
const morgan = require("morgan");
const { Pool } = require("pg");
const app = express();

// Choosing port for Express to listen on
const port = process.env.PORT || 4000;

// PostgreSQL connection pool configuration
const pool = new Pool({
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	port: process.env.PGPORT,
});

// Testing the database connection
pool.connect((err, client, release) => {
	if (err) {
		return console.error("Error acquiring client:", err.stack);
	}
	console.log("Connected to PostgreSQL database");
});

app.listen(port, () => {
	console.log(`Server is up and listening on Port ${port}`);
});

//http request logger middleware
app.use(morgan("dev"));
// retrieve data from body
app.use(express.json());

//Get all users
app.get("/api/v1/users", async (req, res) => {
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
});

//Get a user
app.get("/api/v1/users/:userId", async (req, res) => {
  console.log("Getting user with userId: " + req.params.userId);

  try {
    const result = await pool.query(`SELECT * FROM "sharEco-schema"."account" 
    WHERE "accountId" = $1`, [req.params.userId]); 

    res.status(200).json({
      status: "success",
      data: {
        user: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Create a user
app.post("/api/v1/users", async (req, res) => {
	console.log(req.body);

  try { 
    const result = await pool.query(`INSERT INTO "sharEco-schema"."account" 
    (username, password) values ($1, $2) returning *`, [req.body.username, req.body.password]);
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
});

//Update user
app.put("/api/v1/users/:userId", (req, res) => {
	console.log(req.params);
	console.log(req.body);
	res.status(200).json({
		status: "success",
		data: {
			user: "User 1",
		},
	});
});

//Delete user
app.delete("/api/v1/users/:userId", (req, res) => {
	res.status(204).json({
		status: "success",
	});
});