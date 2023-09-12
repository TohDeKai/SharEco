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

// User CRUD operations
app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await db.getUsers();
    res.status(200).json({
      status: "success",
      data: {
        user: users,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/v1/users/userId/:userId", async (req, res) => {
  try {
    console.log("Getting user with userId: " + req.params.userId);
    const user = await db.getUserById(req.params.userId);
    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/v1/users/username/:username", async (req, res) => {
  try {
    const user = await db.getUserByUsername(req.params.username);

    if (user) {
      res.status(200).json({
        status: "success",
        data: {
          user: user,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/v1/users", async (req, res) => {
  const {
    username,
    password,
    email,
    contactNumber,
    userPhotoUrl,
    displayName,
  } = req.body;

  try {
    const user = await db.createUser(
      username,
      password,
      email,
      contactNumber,
      userPhotoUrl,
      displayName
    );

    // Send the newly created user as the response
    res.status(201).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/v1/users/:userId", async (req, res) => {
  try {
    const user = await db.updateUser(
      req.params.userId,
      req.body.username,
      req.body.password,
      req.body.email,
      req.body.contactNumber,
      req.body.userPhotoUrl,
      req.body.isBanned,
      req.body.likedItem,
      req.body.wishList,
      req.body.displayName
    );
    if (user) {
      res.status(200).json({
        status: "success",
        data: {
          user: user,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/v1/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await db.deleteUser(userId);

    if (user) {
      res.status(200).json({
        status: "success",
        data: {
          user: user,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Admin CRUD operations
app.get("/api/v1/admins", async (req, res) => {
  try {
    const admins = await db.getAdmins();
    res.status(200).json({
      status: "success",
      data: {
        admin: admins,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/v1/admins/adminId/:adminId", async (req, res) => {
  try {
    console.log("Getting admin with adminId: " + req.params.adminId);
    const admin = await db.getAdminById(req.params.adminId);
    res.status(200).json({
      status: "success",
      data: {
        admin: admin,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/v1/admins/username/:username", async (req, res) => {
  try {
    const admin = await db.getAdminByUsername(req.params.username);

    if (admin) {
      res.status(200).json({
        status: "success",
        data: {
          admin: admin,
        },
      });
    } else {
      // Handle the case where the admin is not found
      res.status(404).json({ error: "Admin not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/v1/admins", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await db.createAdmin(username, password);

    // Send the newly created user as the response
    res.status(201).json({
      status: "success",
      data: {
        admin: admin,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/v1/admins/:adminId", async (req, res) => {
  try {
    const admin = await db.updateAdmin(
      req.params.adminId,
      req.body.username,
      req.body.password
    );
    if (admin) {
      res.status(200).json({
        status: "success",
        data: {
          admin: admin,
        },
      });
    } else {
      // Handle the case where the admin is not found
      res.status(404).json({ error: "Admin not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/v1/admins/:adminId", async (req, res) => {
  const adminId = req.params.adminId;
  try {
    const admin = await db.deleteAdmin(adminId);

    if (admin) {
      res.status(200).json({
        status: "success",
        data: {
          admin: admin,
        },
      });
    } else {
      // Handle the case where the admin is not found
      res.status(404).json({ error: "Admin not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Auth functionalities
app.post("/api/v1/signIn", auth.SignIn);
app.post("/api/v1/signUp", auth.SignUp);
