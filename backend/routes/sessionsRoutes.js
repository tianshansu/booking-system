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
        staff.name   AS staff_name,
        to_char(s.start_at AT TIME ZONE 'Australia/Melbourne', 'YYYY-MM-DD') AS session_date,
        to_char(s.start_at AT TIME ZONE 'Australia/Melbourne', 'HH24:MI')    AS session_time
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
      date: r.session_date,
      time: r.session_time,
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
