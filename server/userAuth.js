const db = require("./queries/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 12;
// Require:
var postmark = require("postmark");

// Sign in for user portal
const UserSignIn = async (req, res) => {
  const { username, password } = req.body; // Destructure username and password from the request body
  //req.params.username = username;
  console.log(username + " " + password);
  try {
    const user = await db.getUserByUsername(username); // Get the user data
    console.log(user);
    console.log("DEBUG " + username + " " + password);
    if (!user) {
      // If the user is not found, send a 404 response
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.isBanned) {
      // If the user is banned, send a 403 response
      return res.status(403).json({
        status: "error",
        message: "User is banned",
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      // If the passwords match, send a success response
      const jwtToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET
      );
      //if user is banned, cannot log in
      if (!user.isBanned) {
        res.status(200).json({
          status: "success",
          message: "Logged in successfully",
          token: jwtToken,
        });
      } else {
        res.status(403).json({
          status: "error",
          message: "User is banned",
        });
      }
    } else {
      // If the passwords don't match, send a 400 response
      res.status(400).json({
        status: "error",
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error(err);
    // Handle other errors (e.g., database connection issues) with a 500 response
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Send an email:
var client = new postmark.ServerClient(process.env.POSTMARK_API);

// Sign up for user portal NOT DONE
const UserSignUp = async (req, res) => {
  try {
    const hashed = bcrypt.hashSync(req.body.password, saltRounds);
    // Generating a random 6 number code
    const verificationCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const user = db.createUser(
      hashed,
      req.body.email,
      req.body.contactNumber,
      req.body.displayName,
      req.body.username,
      verificationCode
    );

    if (user) {
      client.sendEmailWithTemplate({
        TemplateId: 33604267,
        TemplateModel: {
          name: req.body.displayName,
          product_name: "SharEco",
          signup_code: verificationCode,
        },
        TemplateAlias: "welcome",
        From: "e0772606@u.nus.edu",
        To: req.body.email,
        MessageStream: "outbound",
      });
      res.status(200).json({
        status: "success",
        message: "Signed up successfully",
        data: user,
      });
    }
  } catch (err) {
    console.error(err);
    // Handle other errors (e.g., database connection issues) with a 500 response
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Verifying user using verification code
const UserVerify = async (req, res) => {
  const username = req.body.username;
  const verification = req.body.verification;

  const user = await db.getUserByUsername(username);
  console.log(user);
  console.log(verification);
  if (user.verification == verification) {
    db.verifyUser(username);
    res.status(200).json({
      status: "success",
      message: "User verified successfully",
    });
  } else {
    res.status(400).json({
      status: "error",
      message: "Incorrect verification code",
    });
  }
  try {
  } catch (error) {
    console.error(err);
    // Handle other errors (e.g., database connection issues) with a 500 response
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  UserSignIn,
  UserSignUp,
  UserVerify,
};
