const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT
        s.id,
        s.name,
        s.status,
        s.start_at,
        s.end_at,
        patient.id   AS patient_id,
        patient.name AS patient_name,
        staff.id     AS staff_id,
        staff.name   AS staff_name
      FROM sessions s
      JOIN people patient ON s.patient_id = patient.id
      JOIN people staff   ON s.staff_id   = staff.id
      ORDER BY s.start_at DESC;
    `;
    const { rows } = await pool.query(sql);

    // Convert DB fields -> frontend-friendly fields
    const data = rows.map((r) => ({
      id: r.id,
      title: r.name,
      patientName: r.patient_name,
      staff: r.staff_name,
      status:
        r.status === 0
          ? "Scheduled"
          : r.status === 1
            ? "Completed"
            : "Cancelled",
      date: r.start_at.toISOString().slice(0, 10),
      time: r.start_at.toISOString().slice(11, 16),
      duration: r.end_at
        ? `${Math.round((r.end_at - r.start_at) / 60000)}m`
        : null,
    }));

    res.json(data);
  } catch (err) {
    console.error("GET /sessions error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
