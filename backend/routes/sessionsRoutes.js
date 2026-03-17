const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { DateTime } = require("luxon");

router.get("/", async (req, res) => {
  try {
    // get current page & limit from query
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // filter
    const status = req.query.status;
    const staffId = req.query.staffId;

    let sql = `
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
        to_char(s.start_at AT TIME ZONE 'Australia/Melbourne', 'HH24:MI')    AS session_time,
        to_char(
          s.start_at AT TIME ZONE 'Australia/Melbourne',
          'YYYY-MM-DD"T"HH24:MI'
        ) AS start_at_local,
        to_char(
          s.end_at AT TIME ZONE 'Australia/Melbourne',
          'YYYY-MM-DD"T"HH24:MI'
        ) AS end_at_local
      FROM sessions s
      JOIN people patient ON s.patient_id = patient.id
      JOIN people staff   ON s.staff_id   = staff.id
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    //put status into sql
    if (status !== undefined && status !== "") {
      sql += ` AND s.status = $${index}`;
      values.push(Number(status));
      index++;
    }

    //put staffId into sql
    if (staffId !== undefined && staffId !== "") {
      sql += ` AND s.staff_id = $${index}`;
      values.push(Number(staffId));
      index++;
    }

    // add the remaining sql
    sql += `
      ORDER BY s.start_at DESC
      LIMIT $${index}
      OFFSET $${index + 1};
    `;

    values.push(limit, offset);
    const { rows } = await pool.query(sql, values);

    // Convert DB fields -> frontend-friendly fields
    const data = rows.map((r) => ({
      id: r.id,
      title: r.name,
      patientName: r.patient_name,
      patientId: r.patient_id,
      staff: r.staff_name,
      staffId: r.staff_id,
      status: r.status,
      date: r.session_date,
      time: r.session_time,
      startAt: r.start_at_local,
      endAt: r.end_at_local,
      duration: r.end_at
        ? `${Math.round((r.end_at - r.start_at) / 60000)}m`
        : null,
    }));

    // count total data
    let countSql = `
      SELECT COUNT(*) AS total
      FROM sessions
      WHERE 1=1
    `;

    const countValues = [];
    let countIndex = 1;

    //put status into sql
    if (status !== undefined && status !== "") {
      countSql += ` AND status = $${countIndex}`;
      countValues.push(Number(status));
      countIndex++;
    }

    //put staffId into sql
    if (staffId !== undefined && staffId !== "") {
      countSql += ` AND staff_id = $${countIndex};`;
      countValues.push(Number(staffId));
      countIndex++;
    }

    const result = await pool.query(countSql, countValues);

    const total = Number(result.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    res.json({ data, page, limit, total, totalPages });
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
    console.error("POST /sessions/add-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// edit a session
router.put("/:id", async (req, res) => {
  try {
    const { sessionName, patientId, staffId, status, startAt, endAt } =
      req.body;
    const sessionId = Number(req.params.id);

    if (Number.isNaN(sessionId)) {
      return res.status(400).json({ error: "Invalid session id" });
    }
    if (!sessionName || !sessionName.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    // parse id to number
    const parsedPatientId = Number(patientId);
    const parsedStaffId = Number(staffId);

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
      UPDATE sessions
      SET name=$1, patient_id=$2, staff_id=$3, status=$4, start_at=$5, end_at=$6
      WHERE id=$7
      RETURNING *
    `;

    const { rows } = await pool.query(sql, [
      sessionName,
      parsedPatientId,
      parsedStaffId,
      status,
      startAtWithZone,
      endAtWithZone,
      sessionId,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error("POST /sessions/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete a session
router.delete("/:id", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const sql = `
      DELETE FROM sessions
      WHERE id=$1
      RETURNING *
    `;

    const { rows } = await pool.query(sql, [sessionId]);
    res.json(rows[0]);
  } catch (err) {
    console.error("DELETE /sessions/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
