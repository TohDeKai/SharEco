require("dotenv").config();
const { application } = require("express");
const express = require("express");
const morgan = require("morgan");
const { Pool } = require("pg");
const app = express();

//http request logger middleware
app.use(morgan("dev"));
// retrieve data from body
app.use(express.json());

//Get all users
app.get("/api/v1/users", (req, res) => {
	res.status(200).json({
		status: "success",
		data: {
			user: ["User 1", "User 2", "User 3"],
		},
	});
});

//Get a user
app.get("/api/v1/users/:userId", (req, res) => {
	console.log(req.params);

	res.status(200).json({
		status: "success",
		data: {
			user: "User 1",
		},
	});
});

//Create a user
app.post("/api/v1/users", (req, res) => {
	console.log(req.body);

	res.status(201).json({
		status: "success",
		data: {
			user: "User 1",
		},
	});
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
