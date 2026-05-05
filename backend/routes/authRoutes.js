const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

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

router.get("/me", authMiddleware, async (req, res) => {
  try {
    // get user's email
    const email = req.user.email;

    res.status(200).json({ email });
  } catch (err) {
    console.error("GET /auth/me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "currentPassword and newPassword are required",
      });
    }

    // simple password length check
    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters",
      });
    }

    // find current user by token user id
    const userResult = await pool.query(
      `
      SELECT id, password_hash, status
      FROM users
      WHERE id = $1
      LIMIT 1;
      `,
      [req.user.id],
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // check disabled account
    if (user.status !== 0) {
      return res.status(403).json({ error: "Account disabled" });
    }

    // check current password
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        error: "Current password is incorrect",
      });
    }

    // hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // update password
    await pool.query(
      `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2;
      `,
      [newPasswordHash, req.user.id],
    );

    return res.status(200).json({
      ok: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("PUT /auth/change-password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
