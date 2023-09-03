require("dotenv").config();
const { application } = require("express");
const express = require("express");
const morgan = require("morgan");
const db = require("./queries");
const app = express();

// Choosing port for Express to listen on
const port = process.env.PORT || 4000;

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
