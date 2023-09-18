require("dotenv").config();
const { application } = require("express");
const express = require("express");
const morgan = require("morgan");
const userdb = require("./queries/user");
const admindb = require("./queries/admin");
const listingdb = require("./queries/listing");
const auth = require("./auth.js");
const userAuth = require("./userAuth");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 12;

// Choosing port for Express to listen on
const port = process.env.PORT || 4000;

// Configure CORS to allow requests from your React app's domain (http://localhost:3000)
app.use(
  cors({
    origin: "*", // Replace with your React app's URL
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
    const users = await userdb.getUsers();
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
    const user = await userdb.getUserById(req.params.userId);
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
    const { username } = req.params;
    const user = await userdb.getUserByUsername(username);

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

// Updating user based on userId
app.put("/api/v1/users/:userId", async (req, res) => {
  try {
    const user = await userdb.updateUser(
      req.params.userId,
      req.body.username,
      req.body.password
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

// Creating new user
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
    const user = await userdb.createUser(
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

// Updating user based on username
app.put("/api/v1/users/username/:username", async (req, res) => {
  try {
    const user = await userdb.updateUser(
      req.params.username,
      req.body.username,
      req.body.password,
      req.body.email,
      req.body.contactNumber,
      req.body.userPhotoUrl,
      req.body.isBanned,
      req.body.likedItem,
      req.body.wishList,
      req.body.displayName,
      req.body.aboutMe
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
    const user = await userdb.deleteUser(userId);

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

// Create a new User upon Signing Up
app.post("/api/v1/userSignUp", async (req, res) => {
  const { username, password, email, contactNumber, displayName, isBanned } =
    req.body;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    const result = await userdb.createUser(
      username,
      hashedPassword,
      email,
      contactNumber,
      displayName,
      isBanned
    );

    res.status(201).json({
      status: "success",
      data: {
        result: result,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
});

// compare password
app.get("/api/v1/users/:username/:password", async (req, res) => {
  const { username, password } = req.params;

  try {
    const result = await userdb.getUserByUsername(username);

    if (bcrypt.compareSync(password, result.password)) {
      res.status(201).json({
        status: "success",
        data: {
          result: result,
        },
      });
    } else {
      // If the passwords don't match, send a 400 response
      res.status(400).json({
        status: "error",
        message: "Incorrect password",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// update password
app.put("/api/v1/users/username/changePassword/:username", async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
  try {
    const user = await userdb.updateUser(
      req.params.username,
      req.body.username,
      hashedPassword,
      req.body.email,
      req.body.contactNumber,
      req.body.userPhotoUrl,
      req.body.isBanned,
      req.body.likedItem,
      req.body.wishList,
      req.body.displayName,
      req.body.aboutMe
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

// Admin CRUD operations
app.get("/api/v1/admins", async (req, res) => {
  try {
    const admins = await admindb.getAdmins();
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
    const admin = await admindb.getAdminById(req.params.adminId);
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
    const admin = await admindb.getAdminByUsername(req.params.username);

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
    const admin = await admindb.createAdmin(username, password);

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
    const admin = await admindb.updateAdmin(
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
    const admin = await admindb.deleteAdmin(adminId);

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

//Create item
app.post("/api/v1/items", async (req, res) => {
  const {
    userId,
    itemTitle,
    itemDescription,
    itemOriginalPrice,
    rentalRateHourly,
    rentalRateDaily,
    depositFee,
    images,
    category,
    collectionLocations,
  } = req.body;

  try {
    const item = await listingdb.createItem(
      userId,
      itemTitle,
      itemDescription,
      itemOriginalPrice,
      rentalRateHourly,
      rentalRateDaily,
      depositFee,
      images,
      category,
      collectionLocations
    );

    // Send the newly created user as the response
    res.status(201).json({
      status: "success",
      data: {
        item: item,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Update item
app.put("/api/v1/items/itemId/:itemId", async (req, res) => {
  try {
    const item = await listingdb.updateItem(
      req.params.itemId,
      req.body.itemTitle,
      req.body.itemDescription,
      req.body.itemOriginalPrice,
      req.body.rentalRateHourly,
      req.body.rentalRateDaily,
      req.body.depositFee,
      req.body.images,
      req.body.category,
      req.body.collectionLocations
    );

    if (item) {
      res.status(200).json({
        status: "success",
        data: {
          item: item,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Delete item
//Disabling item
app.put("/api/v1/items/:itemId", async (req, res) => {
  try {
    const item = await listingdb.disableItem(
      req.params.itemId,
      req.body.disabled
    );

    if (item) {
      res.status(200).json({
        status: "success",
        data: {
          item: item,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Get item
app.get("/api/v1/items/itemId/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const item = await listingdb.getItemByItemId(itemId);

    if (item) {
      res.status(200).json({
        status: "success",
        data: {
          item: item,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//Get items by user id
app.get("/api/v1/items/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const items = await listingdb.getItemsByUserId(userId);

    if (items) {
      res.status(200).json({
        status: "success",
        data: {
          items: items,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// Auth functionalities
app.post("/api/v1/admin/signIn", auth.AdminSignIn);
app.post("/api/v1/admin/signUp", auth.AdminSignUp);
app.post("/api/v1/user/signIn", userAuth.UserSignIn);
app.post("/api/v1/user/signUp", userAuth.UserSignUp);
