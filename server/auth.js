const db = require("./queries/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 12;

// Sign in for admin portal
const AdminSignIn = async (username, password) => {
  try {
    const admin = await db.getAdminByUsername(username); // Get the admin data
    console.log(admin);
    if (!admin) {
      throw new Error("Admin not found");
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

      return jwtToken;
    } else {
      throw new Error("Incorrect password");
    }
  } catch (err) {
    throw err;
  }
};

// Sign up for admin portal
const AdminSignUp = async (username, password) => {
  try {
    const hashed = bcrypt.hashSync(password, saltRounds);
    const admin = db.createAdmin(username, hashed);
    return admin;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  AdminSignIn,
  AdminSignUp,
};
