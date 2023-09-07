const db = require("./queries");

const SignIn = async (req, res) => {
  const { username, password } = req.body; // Destructure username and password from the request body
  req.params.username = username;
  try {
    const user = await db.getUserByUsername(req, res); // Get the user data
    console.log(user);
    if (!user) {
      // If the user is not found, send a 404 response
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if the provided password matches the user's password
    if (password === user.password) {
      // If the passwords match, send a success response
      res.status(200).json({
        status: "success",
        message: "Logged in successfully",
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

module.exports = {
  SignIn,
};