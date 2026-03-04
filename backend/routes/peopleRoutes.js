const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.get("/", async (req, res) => {
  try {
    // Get people + last session date (computed from sessions table)
    const sql = `
      SELECT
        p.id,
        p.name,
        p.email,
        p.phone,
        p.status, -- 0/1
        p.notes,
        MAX(s.start_at) AS last_session
      FROM people p
      LEFT JOIN sessions s
        ON s.patient_id = p.id
      WHERE p.role = 0  -- only patients (0=patient)
      GROUP BY p.id
      ORDER BY p.id;
    `;

    const { rows } = await pool.query(sql);

    // Convert DB fields -> frontend-friendly fields
    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      status: r.status === 0 ? "Active" : "Inactive",
      lastSession: r.last_session
        ? r.last_session.toISOString().slice(0, 10)
        : null,
      notes: r.notes,
    }));

    res.json(data);
  } catch (err) {
    console.error("GET /people error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
