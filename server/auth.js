const db = require("./queries");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 12;

// Sign in for admin portal
const AdminSignIn = async (req, res) => {
  const { username, password } = req.body; // Destructure username and password from the request body
  req.params.username = username;
  try {
    const admin = await db.getAdminByUsername(username); // Get the admin data
    console.log(admin);
    if (!admin) {
      // If the admin is not found, send a 404 response
      return res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
    }

    if (bcrypt.compareSync(password, admin.password)) {
      // If the passwords match, send a success response
      const jwtToken = jwt.sign(
        {
          id: admin.id,
          username: admin.username,
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

// Sign up for admin portal
const AdminSignUp = async (req, res) => {
  try {
    const hashed = bcrypt.hashSync(req.body.password, saltRounds);
    const admin = db.createAdmin(req.body.username, hashed);
    if (admin) {
      res.status(200).json({
        status: "success",
        message: "Signed up successfully",
        data: admin,
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
  AdminSignIn,
  AdminSignUp,
};
