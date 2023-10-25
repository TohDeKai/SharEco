require("dotenv").config();
const { application } = require("express");
const express = require("express");
const morgan = require("morgan");
const userdb = require("./queries/user");
const admindb = require("./queries/admin");
const listingdb = require("./queries/listing");
const rentaldb = require("./queries/rental");
const reviewdb = require("./queries/review");
const businessdb = require("./queries/businessVerifications");
const spotlightdb = require("./queries/spotlight");
const wishlistdb = require("./queries/wishlist");
const transactiondb = require("./queries/transaction");
const auth = require("./auth.js");
const userAuth = require("./userAuth");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const axios = require("axios");

const multer = require("multer");
const fs = require("fs");
const stripe = require("stripe")(
  "sk_test_51O18L3H2N8GaqjXUCdY2UTSePPVKWxSltauacIasCcfiHk22yXCzMxv4YrMO3qO8idVDHyVSLwGysdV7OCjRnSpz006623c5ON"
);

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { filename } = req.params;
    console.log(file);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// S3 BASE URL for GET & PUT request
const { AWS_GETFILE_URL } = require("./s3");

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

//Get Wallet ID by user ID
app.get("/api/v1/users/walletId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const walletId = await userdb.getWalletIdByUserId(userId);

    if (walletId) {
      res.status(200).json({
        status: "success",
        data: {
          walletId: walletId,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "walletId not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Get Wallet Balance by user ID
app.get("/api/v1/users/walletBalance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const walletBalance = await userdb.getWalletBalanceByUserId(userId);

    if (walletBalance) {
      res.status(200).json({
        status: "success",
        data: {
          walletBalance: walletBalance,
        },
      });
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "walletBalance not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//add wallet ID to user
app.put("/api/v1/users/walletId/:userId", async (req, res) => {
  try {
    const user = await userdb.addWalletIdToUser(
      req.params.userId,
      req.body.walletId
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

//update wallet Balance to user
app.put("/api/v1/users/walletBalance/:userId", async (req, res) => {
  try {
    const user = await userdb.updateUserWalletBalance(
      req.params.userId,
      req.body.walletBalance
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

//update wallet Balance to admin
app.put("/api/v1/users/adminWalletBalance", async (req, res) => {
  try {
    const user = await userdb.updateAdminWalletBalance(req.body.walletBalance);
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

// Adding business verification to a user based on user ID
app.put("/api/v1/users/businessVerification/:userId", async (req, res) => {
  try {
    const user = await userdb.addVerificationToUser(
      req.params.userId,
      req.body.businessVerificationId
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

// ban and unban user based on username
app.put("/api/v1/users/ban/username", async (req, res) => {
  try {
    var user = await userdb.getUserByUsername(req.body.username);
    user = await userdb.updateUser(
      user.username,
      user.username,
      user.password,
      user.email,
      user.contactNumber,
      user.userPhotoUrl,
      req.body.isBanned,
      user.likedItem,
      user.wishList,
      user.displayName,
      user.aboutMe
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
    otherLocation,
    isBusiness,
    checklistCriteria,
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
      collectionLocations,
      otherLocation,
      isBusiness,
      checklistCriteria
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
      req.body.collectionLocations,
      req.body.otherLocation
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

//update item images only
app.put("/api/v1/items/itemId/:itemId/images", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const images = req.body.images;

    // Update the images associated with the item using the itemId and the new images array
    const updatedImages = await listingdb.updateItemImages(itemId, images);

    if (updatedImages) {
      res.status(200).json({
        status: "success",
        data: {
          images: updatedImages,
        },
      });
    } else {
      // Handle the case where the item is not found or the update fails
      res.status(404).json({ error: "Item not found or image update failed" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Delete item
//Disabling item
app.put("/api/v1/items/disable/itemId/:itemId", async (req, res) => {
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

//Get all items
app.get("/api/v1/items", async (req, res) => {
  try {
    const items = await listingdb.getAllItems();

    if (items) {
      res.status(200).json({
        status: "success",
        data: {
          items: items,
        },
      });
    } else {
      // Handle the case where no items are found
      res.status(404).json({ error: "No Items Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//Get other people's items
app.get("/api/v1/items/not/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const items = await listingdb.getOtherUserItems(userId);

    if (items) {
      res.status(200).json({
        status: "success",
        data: {
          items: items,
        },
      });
    } else {
      // Handle the case where no items are found
      res.status(404).json({ error: "No Items Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//Get other people's items by keywords
app.get("/api/v1/items/not/:userId/keywords", async (req, res) => {
  const userId = req.params.userId;
  const keywords = req.query.keywords.split(/[ +]/);

  try {
    const items = await listingdb.getOtherUserItemsByKeywords(userId, keywords);

    if (items) {
      res.status(200).json({
        status: "success",
        data: {
          items: items,
        },
      });
    } else {
      // Handle the case where no items are found
      res.status(404).json({ error: "No Items Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//Get other people's items by category
app.get("/api/v1/items/not/:userId/category/:category", async (req, res) => {
  const userId = req.params.userId;
  const category = req.params.category;

  try {
    const items = await listingdb.getOtherUserItemsByCategory(userId, category);

    if (items.length > 0) {
      res.status(200).json({
        status: "success",
        data: {
          items: items,
        },
      });
    } else {
      // Handle the case where no items are found
      res.status(404).json({ error: "No Items Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//Get other people's items by category by keywords
app.get(
  "/api/v1/items/not/:userId/category/:category/keywords",
  async (req, res) => {
    const userId = req.params.userId;
    const category = req.params.category;
    const keywords = req.query.keywords.split(/[ +]/);

    try {
      const items = await listingdb.getOtherUserItemsByCategoryByKeywords(
        userId,
        category,
        keywords
      );

      if (items) {
        res.status(200).json({
          status: "success",
          data: {
            items: items,
          },
        });
      } else {
        // Handle the case where no items are found
        res.status(404).json({ error: "No Items Found" });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);

// Auth functionalities
app.post("/api/v1/admin/signIn", async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await auth.AdminSignIn(username, password);

    // Send the newly created user as the response
    res.status(200).json({
      status: "success",
      data: {
        token: token,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err.message);
    if (err.message == "Admin not found") {
      res.status(404).json({ status: "error", error: err.message });
    } else if (err.message == "Incorrect password") {
      res.status(400).json({ status: "error", error: err.message });
    } else {
      res.status(500).json({ status: "error", error: err.message });
    }
  }
});

// Admin Auth Functionalities
app.post("/api/v1/admin/signUp", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await auth.AdminSignUp(username, password);

    // Send the newly created user as the response
    res.status(200).json({
      status: "success",
      data: {
        admin: admin,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err.message);
    res.status(500).json({ status: "error", error: err });
  }
});

// User Auth Functionalities
app.post("/api/v1/user/signIn", userAuth.UserSignIn);
app.post("/api/v1/user/signUp", userAuth.UserSignUp);

// Business Verification functionalites

// Get all business verifications
app.get("/api/v1/businessVerifications", async (req, res) => {
  try {
    const businessVerifications = await businessdb.getBusinessVerifications();
    res.status(200).json({
      status: "success",
      data: {
        businessVerifications: businessVerifications,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get(
  "/api/v1/businessVerifications/businessVerificationId/:businessVerificationId",
  async (req, res) => {
    try {
      const businessVerification =
        await businessdb.getBusinessVerificationByBusinessVerificationId(
          req.params.businessVerificationId
        );
      if (businessVerification) {
        res.status(200).json({
          status: "success",
          data: {
            businessVerification: businessVerification,
          },
        });
      } else {
        // Handle the case where the business verification is not found
        res.status(404).json({ error: "Business verification not found" });
      }
    } catch (err) {
      // Handle the error here if needed
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Creating new business verification request
app.post("/api/v1/businessVerifications", async (req, res) => {
  const { UEN, documents, approved, originalUserId } = req.body;

  try {
    const businessVerifications = await businessdb.createBusinessVerification(
      UEN,
      documents,
      approved,
      originalUserId
    );

    // Send the newly created business verification as the response
    res.status(201).json({
      status: "success",
      data: {
        businessVerifications: businessVerifications,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Updating business verification request
app.put(
  "/api/v1/businessVerifications/businessVerificationId/:businessVerificationId",
  async (req, res) => {
    try {
      const businessVerification = await businessdb.updateBusinessVerification(
        req.params.businessVerificationId,
        req.body.UEN,
        req.body.documents,
        req.body.approved,
        req.body.originalUserId
      );

      if (businessVerification) {
        res.status(200).json({
          status: "success",
          data: {
            businessVerification: businessVerification,
          },
        });
      } else {
        // Handle the case where the business verification is not found
        res.status(404).json({ error: "Business Verification not found" });
      }
    } catch (err) {
      // Handle the error here if needed
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

//update businessVerification documents only
app.put(
  "/api/v1/businessVerifications/businessVerificationId/:businessVerificationId/documents",
  async (req, res) => {
    try {
      const businessVerificationId = req.params.businessVerificationId;
      const documents = req.body.documents;

      // Update the documents associated with the businessverification
      const updatedFiles =
        await businessdb.updateDocumentsForBusinessVerification(
          businessVerificationId,
          documents
        );

      if (updatedFiles) {
        res.status(200).json({
          status: "success",
          data: {
            documents: updatedFiles,
          },
        });
      } else {
        // Handle the case where the item is not found or the update fails
        res.status(404).json({ error: "Item not found or file update failed" });
      }
    } catch (err) {
      // Handle the error here if needed
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Approve business verification request based on business verification Id
app.put(
  "/api/v1/businessVerifications/approve/businessVerificationId",
  async (req, res) => {
    try {
      var businessVerification = await businessdb.getBusinessVerificationById(
        req.body.businessVerificationId
      );
      businessVerification = await businessdb.updateBusinessVerification(
        businessVerification.businessVerificationId,
        businessVerification.UEN,
        businessVerification.documents,
        req.body.approved,
        businessVerification.originalUserId
      );

      if (businessVerification) {
        res.status(200).json({
          status: "success",
          data: {
            businessVerification: businessVerification,
          },
        });
      } else {
        // Handle the case where the business verification is not found
        res.status(404).json({ error: "Business Verification not found" });
      }
    } catch (err) {
      // Handle the error here if needed
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Delete business verification request
app.delete(
  "/api/v1/businessVerifications/businessVerificationId",
  async (req, res) => {
    const businessVerificationId = req.params.businessVerificationId;
    try {
      const businessVerification = await businessdb.deleteBusinessVerification(
        businessVerificationId
      );

      if (businessVerification) {
        res.status(200).json({
          status: "success",
          data: {
            businessVerification: businessVerification,
          },
        });
      } else {
        // Handle the case where the businessVerification is not found
        res.status(404).json({ error: "Business Verification not found" });
      }
    } catch (err) {
      // Handle the error here if needed
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

//RENTAL REQUEST FUNCTIONALITIES
//Create a new rental request
app.post("/api/v1/rental", async (req, res) => {
  const {
    startDate,
    endDate,
    collectionLocation,
    additionalRequest,
    depositFee,
    rentalFee,
    itemId,
    borrowerId,
    lenderId,
    totalFee,
    isHourly,
  } = req.body;

  try {
    const rental = await rentaldb.createRentalRequest(
      startDate,
      endDate,
      collectionLocation,
      additionalRequest,
      depositFee,
      rentalFee,
      itemId,
      borrowerId,
      lenderId,
      totalFee,
      isHourly
    );

    // Send the newly created business verification as the response
    res.status(201).json({
      status: "success",
      data: {
        rental: rental,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Edit Rental request
app.put("/api/v1/rental/rentalId/:rentalId", async (req, res) => {
  try {
    const rental = await rentaldb.editRentalRequest(
      req.params.rentalId,
      req.body.collectionLocation,
      req.body.additionalRequest,
      req.body.status
    );

    if (rental) {
      res.status(200).json({
        status: "success",
        data: {
          rental: rental,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Rental Request not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete rental request
app.delete("/api/v1/rental/:rentalId", async (req, res) => {
  const rentalId = req.params.rentalId;
  try {
    const rental = await rentaldb.deleteRentalRequest(rentalId);

    if (rental) {
      res.status(200).json({
        status: "success",
        data: {
          rental: rental,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Rental Request not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all rental requests
app.get("/api/v1/rentals", async (req, res) => {
  try {
    const rentals = await rentaldb.getAllRentals();
    res.status(200).json({
      status: "success",
      data: {
        rentals: rentals,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Rental by Rental Id
app.get("/api/v1/rentals/rentalId/:rentalId", async (req, res) => {
  try {
    const rental = await rentaldb.getRentalByRentalId(req.params.rentalId);
    if (rental) {
      res.status(200).json({
        status: "success",
        data: {
          rental: rental,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Rental Request not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Rental by Lender Id
app.get("/api/v1/rentals/lenderId/:lenderId", async (req, res) => {
  try {
    const rental = await rentaldb.getRentalsByLenderId(req.params.lenderId);
    if (rental.length != 0) {
      res.status(200).json({
        status: "success",
        data: {
          rental: rental,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Rental Request not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Rentals by Lender Id and Item Id
app.get(
  "/api/v1/rentals/lenderId/:lenderId/itemId/:itemId",
  async (req, res) => {
    try {
      const rentals = await rentaldb.getRentalsByLenderAndItemId(
        req.params.lenderId,
        req.params.itemId
      );
      if (rentals.length !== 0) {
        res.status(200).json({
          status: "success",
          data: {
            rentals: rentals,
          },
        });
      } else {
        res
          .status(404)
          .json({ error: "No rentals found for the given lender and item" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Get Rental by Borrower Id
app.get("/api/v1/rentals/borrowerId/:borrowerId", async (req, res) => {
  try {
    const rental = await rentaldb.getRentalsByBorrowerId(req.params.borrowerId);
    if (rental.length != 0) {
      res.status(200).json({
        status: "success",
        data: {
          rental: rental,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Rental Request not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Rental by Item Id
app.get("/api/v1/rentals/itemId/:itemId", async (req, res) => {
  try {
    const rental = await rentaldb.getRentalsByItemId(req.params.itemId);
    if (rental.length != 0) {
      res.status(200).json({
        status: "success",
        data: {
          rental: rental,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Rental Request not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Update rental status
app.patch("/api/v1/rental/status/:rentalId", async (req, res) => {
  try {
    let rental;
    const status = req.body.status;
    if (status === "CANCELLED") {
      const cancellationReason = req.body.cancellationReason;
      rental = await rentaldb.updateRentalStatusToCancel(
        status,
        req.params.rentalId,
        cancellationReason
      );
    } else {
      rental = await rentaldb.updateRentalStatus(status, req.params.rentalId);
    }
    if (rental) {
      res.status(200).json({
        status: "success",
        data: {
          rental: rental,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Rental Request not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Get rental availability by listing Id and date
app.get("/api/v1/item/availability/:itemId/:date", async (req, res) => {
  try {
    console.log("Request Parameters:", req.params);
    const intervals = await rentaldb.getAvailByRentalIdAndDate(
      req.params.itemId,
      req.params.date
    );
    console.log(intervals);
    if (intervals) {
      res.status(200).json({
        status: "success",
        data: {
          intervals: intervals,
        },
      });
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Get daily rental availability by listing Id
app.get("/api/v1/item/unavailability/:itemId", async (req, res) => {
  try {
    console.log("Request Parameters:", req.params);
    const unavail = await rentaldb.getDailyUnavailability(req.params.itemId);
    console.log(unavail);
    if (unavail) {
      res.status(200).json({
        status: "success",
        data: {
          unavail: unavail,
        },
      });
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Get full day unavailability by listing Id
app.get("/api/v1/item/unavailability/fullDay/:itemId", async (req, res) => {
  try {
    console.log("Request Parameters:", req.params);
    const unavail = await rentaldb.getFullDayUnavailability(req.params.itemId);
    if (unavail) {
      res.status(200).json({
        status: "success",
        data: {
          unavail: unavail,
        },
      });
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Get next booking by listing Id and date
app.get("/api/v1/item/nextBooking/:itemId/:date", async (req, res) => {
  try {
    console.log("Request Parameters:", req.params);
    const booking = await rentaldb.getNextRentalByItemIdAndDate(
      req.params.itemId,
      req.params.date
    );
    if (booking) {
      res.status(200).json({
        status: "success",
        data: {
          booking: booking,
        },
      });
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//BLOCKOUT
// Create blockout
app.post("/api/v1/createBlockout", async (req, res) => {
  const {
    startDate,
    endDate,
    itemId,
    lenderId,
  } = req.body;

  try {
    const blockout = await rentaldb.createBlockout(
      startDate,
      endDate,
      itemId,
      lenderId,
    );

    res.status(200).json({
      status: "success",
      data: {
        blockout: blockout,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete blockout
app.delete("/api/v1/deleteBlockout/:blockoutId", async (req, res) => {
  const blockoutId = req.params.blockoutId;
  try {
    const blockout = await rentaldb.deleteBlockout(blockoutId);

    if (blockout) {
      res.status(200).json({
        status: "success",
        data: {
          blockout: blockout,
        },
      });
    } else {
      // Handle the case where the review was not found
      res.status(404).json({ error: "Blockout was not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//SPOTLIGHT
// Creating new spotlight
app.post("/api/v1/spotlight", async (req, res) => {
  const { duration, price, itemId } = req.body;

  try {
    const spotlight = await spotlightdb.createSpotlight(
      duration,
      price,
      itemId
    );

    // Send the newly created user as the response
    res.status(200).json({
      status: "success",
      data: {
        spotlight: spotlight,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put(
  "/api/v1/rental/rentalId/:rentalId/handoverChecklist",
  async (req, res) => {
    console.log("Request recieved for submit handover checklist");
    const rentalId = req.params.rentalId;
    const {
      checklistFormType,
      checklist,
      existingDamages,
      newDamages,
      images,
    } = req.body;

    try {
      if (checklistFormType == "Start Rental") {
        //add checklist to startRentalCheckList, add existingDamages to startRentalDamages, add images to startRentalImages
        const rental = await rentaldb.submitStartRentalChecklist(
          rentalId,
          checklist,
          existingDamages,
          images
        );

        if (rental) {
          res.status(200).json({
            status: "success",
            data: {
              rental: rental,
            },
          });
        } else {
          // Handle the case where the rental request is not found
          res.status(404).json({ error: "Rental Request not found" });
        }
      } else if (checklistFormType == "End Rental") {
        //add checklist to endRentalCheckList, add newDamages to endRentalDamages, add images to endRentalImages
        const rental = await rentaldb.submitEndRentalChecklist(
          rentalId,
          checklist,
          newDamages,
          images
        );

        if (rental) {
          res.status(200).json({
            status: "success",
            data: {
              rental: rental,
            },
          });
        } else {
          // Handle the case where the rental request is not found
          res.status(404).json({ error: "Rental Request not found" });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Update Rental Upon Being Reviewed By Lender
app.patch(
  "/api/v1/rental/lenderReview/:rentalId/:reviewId",
  async (req, res) => {
    try {
      const { rentalId, reviewId } = req.params;
      const review = rentaldb.updateRentalUponLenderReview(reviewId, rentalId);

      if (review) {
        res.status(200).json({
          status: "success",
          data: {
            review: review,
          },
        });
      } else {
        // Handle the case where the review is not found
        res.status(404).json({ error: "Review was not found" });
      }
    } catch (error) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Update Rental Upon Being Reviewed By Borrower
app.patch(
  "/api/v1/rental/borrowerReview/:rentalId/:reviewId",
  async (req, res) => {
    try {
      const { rentalId, reviewId } = req.params;
      const review = rentaldb.updateRentalUponBorrowerReview(
        reviewId,
        rentalId
      );

      if (review) {
        res.status(200).json({
          status: "success",
          data: {
            review: review,
          },
        });
      } else {
        // Handle the case where the review is not found
        res.status(404).json({ error: "Review was not found" });
      }
    } catch (error) {
      console.log(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

/**********************          Review Routes             **************************/
// Get all Reviews
app.get("/api/v1/reviews", async (req, res) => {
  try {
    const reviews = await reviewdb.getAllReviews();
    res.status(200).json({
      status: "success",
      data: {
        reviews: reviews,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Review by reviewId
app.get("/api/v1/reviews/reviewId/:reviewId", async (req, res) => {
  try {
    const review = await reviewdb.getReviewByReviewId(req.params.reviewId);
    if (review.length != 0) {
      res.status(200).json({
        status: "success",
        data: {
          review: review,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Review  not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Reviews by revieweeId
app.get("/api/v1/reviews/revieweeId/:revieweeId", async (req, res) => {
  try {
    const reviews = await reviewdb.getReviewsByRevieweeId(
      req.params.revieweeId
    );
    if (reviews.length != 0) {
      res.status(200).json({
        status: "success",
        data: {
          reviews: reviews,
        },
      });
    } else {
      // Handle the case where the rental request is not found
      res.status(404).json({ error: "Reviews  not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a Review
app.post("/api/v1/reviews", async (req, res) => {
  const {
    rating,
    comments,
    revieweeIsLender,
    reviewerId,
    revieweeId,
    rentalId,
  } = req.body;

  try {
    const review = await reviewdb.createReview(
      rating,
      comments,
      revieweeIsLender,
      reviewerId,
      revieweeId,
      rentalId
    );

    // Send the newly created review as the response
    res.status(201).json({
      status: "success",
      data: {
        review: review,
      },
    });
  } catch (error) {
    // Handle the error here if needed
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete Review by review Id
app.delete("/api/v1/reviews/:reviewId", async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await reviewdb.deleteReview(reviewId);

    if (review) {
      res.status(200).json({
        status: "success",
        data: {
          review: review,
        },
      });
    } else {
      // Handle the case where the review was not found
      res.status(404).json({ error: "Review was not found" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//STRIPE TEST
app.post("/api/v1/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const walletId = req.body.walletId;
  const amount = req.body.amount;
  const customer =
    walletId != ""
      ? await stripe.customers.retrieve(walletId)
      : await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2023-08-16" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount != null ? amount : 0,
    currency: "sgd",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51O18L3H2N8GaqjXUYaNSlFFvrC0zxh65jLr9QeCqls1RqGlmAWqE15MSpkmxcJUtJW1d0f37sTN0wcR2qrUJILa800K5tC2yfH",
  });

  

});

// Get average rating by userId
app.get("/api/v1/ratings/userId/:userId", async (req, res) => {
  try {
    const { averageRating, numberOfRatings } = await reviewdb.getRatingByUserId(
      req.params.userId
    );
    if (averageRating) {
      res.status(200).json({
        status: "success",
        data: {
          averageRating: averageRating.toFixed(1), //formats to 1dp
          starsToDisplay: Math.round(averageRating), //rounds to nearest whole star (eg 4.4 round to 4, 4.5 round to 5)
          numberOfRatings: numberOfRatings,
        },
      });
    } else {
      // Handle the case where the user has no ratings
      res.status(404).json({ error: "Cannot calculate rating" });
    }
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

/**********************          Wishlist Routes             **************************/
// Add to wishlist
app.post("/api/v1/wishlist", async (req, res) => {
  const { itemId, userId } = req.body;

  try {
    const wishlist = await wishlistdb.createWishList(itemId, userId);

    // Send the newly created wishlist as response
    res.status(201).json({
      status: "success",
      data: {
        wishlist: wishlist,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Remove from wishlist
app.delete(
  "/api/v1/wishlist/itemId/:itemId/userId/:userId",
  async (req, res) => {
    const itemId = req.params.itemId;
    const userId = req.params.userId;

    try {
      const wishlist = await wishlistdb.removeWishlist(itemId, userId);

      if (wishlist) {
        res.status(200).json({
          status: "success",
          data: {
            wishlist: wishlist,
          },
        });
      } else {
        // if wishlist not found
        res.status(404).json({ error: "Wishlist not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Get wishlist by itemId
app.get("/api/v1/wishlist/itemId/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const wishlist = await wishlistdb.getWishlistByItemId(itemId);

    if (wishlist.length > 0) {
      res.status(200).json({
        status: "success",
        data: {
          wishlist: wishlist,
        },
      });
    } else {
      // if wishlist not found
      res.status(404).json({ error: "Wishlist not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get items by wishlist userId
app.get("/api/v1/wishlist/userId/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const items = await wishlistdb.getItemsByWishlistUserId(userId);

    if (items.length > 0) {
      res.status(200).json({
        status: "success",
        data: {
          wishlist: items,
        },
      });
    } else {
      // if items not found
      res.status(404).json({ error: "Items not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get wishlist by itemId and userId
app.get("/api/v1/wishlist/itemId/:itemId/userId/:userId", async (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.params.userId;

  try {
    const wishlist = await wishlistdb.getWishlistByItemIdAndUserId(
      itemId,
      userId
    );

    if (wishlist) {
      res.status(200).json({
        status: "success",
        data: {
          wishlist: wishlist,
        },
      });
    } else {
      // if wishlist not found
      res.status(404).json({ error: "Wishlist not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

/**********************          Transaction Routes             **************************/
//create transaction without handling wallet balance
app.post("/api/v1/transaction", async (req, res) => {
  const { senderId, receiverId, amount, transactionType } = req.body;

  try {
    const transaction = await transactiondb.createTransaction(
      senderId,
      receiverId,
      amount,
      transactionType
    );

    // Send the newly created user as the response
    res.status(200).json({
      status: "success",
      data: {
        transaction: transaction,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//create withdrawal request without handling wallet balance
app.post("/api/v1/transaction/withdrawalRequest", async (req, res) => {
  const { senderId, amount } = req.body;

  try {
    const transaction = await transactiondb.createWithdrawalRequest(
      receiverId,
      amount
    );

    // Send the newly created user as the response
    res.status(200).json({
      status: "success",
      data: {
        transaction: transaction,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// approve withdrawal request and handle wallet balance
app.post("/api/v1/transaction/withdrawalRequest/approve", async (req, res) => {
  const transactionId = req.body.transactionId;
  console.log(transactionId);
  try {
    const transactions = await transactiondb.approveWithdrawalRequest(
      transactionId
    );
    res.status(200).json({
      status: "success",
      data: {
        transactions: transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

//transfer money from user to user wallet balance updated
app.post("/api/v1/transaction/transfer", async (req, res) => {
  const { senderUsername, receiverUsername, amount } = req.body;

  try {
    const transaction = await transactiondb.transferBetweenUsers(
      senderUsername,
      receiverUsername,
      amount
    );

    // Send the newly created user as the response
    res.status(200).json({
      status: "success",
      data: {
        transaction: transaction,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//transfer money from user to admin, wallet balance updated
app.post("/api/v1/transaction/toAdmin", async (req, res) => {
  const { senderId, amount, transactionType } = req.body;

  try {
    const transaction = await transactiondb.transactionToAdmin(
      senderId,
      amount,
      transactionType
    );

    // Send the newly created user as the response
    res.status(200).json({
      status: "success",
      data: {
        transaction: transaction,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

//transfer money from admin to user, wallet balance updated
app.post("/api/v1/transaction/fromAdmin", async (req, res) => {
  const { receiverId, amount, transactionType } = req.body;

  try {
    const transaction = await transactiondb.transactionFromAdmin(
      receiverId,
      amount,
      transactionType
    );

    // Send the newly created user as the response
    res.status(200).json({
      status: "success",
      data: {
        transaction: transaction,
      },
    });
  } catch (err) {
    // Handle the error here if needed
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get transactions by receiverId
app.get("/api/v1/transaction/receiverId/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const transactions = await transactiondb.getTransactionsByReceiverId(
      userId
    );
    res.status(200).json({
      status: "success",
      data: {
        transactions: transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get transactions by senderId
app.get("/api/v1/transaction/senderId/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const transactions = await transactiondb.getTransactionsBySenderId(userId);
    res.status(200).json({
      status: "success",
      data: {
        transactions: transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});
