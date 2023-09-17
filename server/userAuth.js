const db = require("./queries/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 12;

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

    if (bcrypt.compareSync(password, user.password)) {
      // If the passwords match, send a success response
      const jwtToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        token: jwtToken,
      });
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

// Sign up for user portal NOT DONE
const UserSignUp = async (req, res) => {
  try {
    const hashed = bcrypt.hashSync(req.body.password, saltRounds);
    const user = db.createUser(
      hashed,
      req.body.email,
      req.body.contactNumber,
      req.body.displayName,
      req.body.username
    );
    if (user) {
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

module.exports = {
  UserSignIn,
  UserSignUp,
};
