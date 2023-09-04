const express = require("express");
const router = express.Router();
const pool = require("../utils/db");

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query(
      'SELECT * FROM "sharEco-schema"."admin" WHERE username = $1',
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Admin does not exist!" });
    }

    if (password !== user.rows[0].password) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    return user;
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
