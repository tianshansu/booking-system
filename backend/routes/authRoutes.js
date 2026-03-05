const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    // get email & password from request
    const { email, password } = req.body;

    // if no email or password return 400 to frontend
    if (!email || !password) {
      return res.status(400).json({ error: "email/password required" });
    }
    // Find user by email
    const sql = `
        SELECT id, email, password_hash, status
        FROM users
        WHERE email = $1
        LIMIT 1;
    `;

    // search for account in db
    const { rows } = await pool.query(sql, [email]);
    const user = rows[0];

    // if user does not exist
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // disabled account check (status: 0=active, 1=disabled)
    if (user.status !== 0) {
      return res.status(403).json({ error: "Account disabled" });
    }

    // Compare password with hash
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token & return to frontend
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
    return res.json({
      ok: true,
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("POST /auth/login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
