const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { DateTime } = require("luxon");

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

// add a session
router.post("/add-session", async (req, res) => {
  try {
    const { sessionName, patientId, staffId, startAt, endAt } = req.body;

    if (!sessionName || !sessionName.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    // parse id to number
    const parsedPatientId = Number(patientId);
    const parsedStaffId = Number(staffId);

    if (Number.isNaN(parsedPatientId) || Number.isNaN(parsedStaffId)) {
      return res.status(400).json({ error: "Invalid patient or staff id" });
    }

    // parse time to time with time zone
    const melbourneStartAt = DateTime.fromISO(startAt, {
      zone: "Australia/Melbourne",
    });

    const melbourneEndAt = DateTime.fromISO(endAt, {
      zone: "Australia/Melbourne",
    });

    if (!melbourneStartAt.isValid || !melbourneEndAt.isValid) {
      return res.status(400).json({ error: "Invalid date/time format" });
    }

    if (melbourneStartAt.toMillis() >= melbourneEndAt.toMillis()) {
      return res
        .status(400)
        .json({ error: "Start time must be earlier than end time" });
    }

    const startAtWithZone = melbourneStartAt.toISO();
    const endAtWithZone = melbourneEndAt.toISO();

    if (!melbourneStartAt.isValid || !melbourneEndAt.isValid) {
      return res.status(400).json({ error: "Invalid date/time format" });
    }

    const sql = `
      INSERT INTO sessions (name, patient_id, staff_id, status, start_at, end_at)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [
      sessionName,
      parsedPatientId,
      parsedStaffId,
      0,
      startAtWithZone,
      endAtWithZone,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /add-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
