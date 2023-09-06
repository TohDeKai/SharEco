require("dotenv").config();
const { application } = require("express");
const express = require("express");
const morgan = require("morgan");
const db = require("./queries");
const auth = require("./auth.js");
const app = express();
const cors = require("cors");

// Choosing port for Express to listen on
const port = process.env.PORT || 4000;

// Configure CORS to allow requests from your React app's domain (http://localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your React app's URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

app.listen(port, () => {
  console.log(`Server is up and listening on Port ${port}`);
});

//http request logger middleware
app.use(morgan("dev"));
// retrieve data from body
app.use(express.json());

app.get("/api/v1/users", db.getUsers);
app.get("/api/v1/users/userId/:userId", db.getUserById);
app.get("/api/v1/users/username/:username", db.getUserByUsername);
app.post("/api/v1/users", db.createUser);
app.put("/api/v1/users/:userId", db.updateUser);
app.delete("/api/v1/users/:userId", db.deleteUser);

app.post("/api/v1/login", auth.SignIn);
