const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { DateTime } = require("luxon");

// helper function to insert activities
async function insertRecentActivity(type, message) {
  const sql = `
    INSERT INTO recent_activity (type, message)
    VALUES ($1, $2);
  `;
  await pool.query(sql, [type, message]);
}

async function logSessionStatusChange(oldStatus, newStatus, patientName) {
  if (oldStatus === newStatus) return;

  if (newStatus === 1) {
    await insertRecentActivity(
      "session_completed",
      `Session completed with ${patientName}`,
    );
  }

  if (newStatus === 2) {
    await insertRecentActivity(
      "session_canceled",
      `Session canceled for ${patientName}`,
    );
  }
}

// export to csv
router.get("/export", async (req, res) => {
  try {
    // filter
    const status = req.query.status;
    const staffId = req.query.staffId;

    // get search
    const search = req.query.search || "";

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
        CASE
          WHEN s.status = 0 THEN 'Scheduled'
          WHEN s.status = 1 THEN 'Completed'
          WHEN s.status = 2 THEN 'Canceled'
          ELSE 'Unknown'
        END AS status_text,
        to_char(s.start_at AT TIME ZONE 'Australia/Melbourne', 'YYYY-MM-DD') AS session_date,
        to_char(s.start_at AT TIME ZONE 'Australia/Melbourne', 'HH24:MI') AS session_time,
        to_char(
          s.start_at AT TIME ZONE 'Australia/Melbourne',
          'YYYY-MM-DD"T"HH24:MI'
        ) AS start_at_local,
        to_char(
          s.end_at AT TIME ZONE 'Australia/Melbourne',
          'YYYY-MM-DD"T"HH24:MI'
        ) AS end_at_local,
        ROUND(EXTRACT(EPOCH FROM (s.end_at - s.start_at)) / 60)::int AS duration_minutes
      FROM sessions s
      JOIN people patient ON s.patient_id = patient.id
      JOIN people staff   ON s.staff_id   = staff.id
      WHERE 1=1
        AND (
          s.name ILIKE $1
          OR patient.name ILIKE $1
          OR staff.name ILIKE $1
        )
    `;

    const values = [];
    values.push(`%${search}%`);
    let index = 2;

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
      ORDER BY s.start_at ASC;
    `;

    const { rows } = await pool.query(sql, values);

    // create csv
    function escapeCsv(value) {
      if (value === null || value === undefined) return "";
      const str = String(value);
      if (str.includes('"') || str.includes(",") || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    const header = [
      "Session",
      "Patient",
      "Staff",
      "Status",
      "Date",
      "Time",
      "Duration (min)",
    ];

    const csvRows = [
      header.join(","),
      ...rows.map((row) =>
        [
          escapeCsv(row.name),
          escapeCsv(row.patient_name),
          escapeCsv(row.staff_name),
          escapeCsv(row.status_text),
          escapeCsv(row.session_date),
          escapeCsv(row.session_time),
          escapeCsv(row.duration_minutes),
        ].join(","),
      ),
    ];

    const csv = csvRows.join("\n");

    const fileName = `sessions-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.status(200).send(csv);
  } catch (err) {
    console.error("GET /sessions/export error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get session (backend pagination)
router.get("/", async (req, res) => {
  try {
    // get current page & limit from query
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // filter
    const status = req.query.status;
    const staffId = req.query.staffId;
    const sortTime = req.query.sortTime === "asc" ? "ASC" : "DESC";

    // get search
    const search = req.query.search || "";

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
        AND (
          s.name ILIKE $1
          OR patient.name ILIKE $1
          OR staff.name ILIKE $1
        )
    `;

    const values = [];
    values.push(`%${search}%`);
    let index = 2;

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
      ORDER BY s.start_at ${sortTime}
      LIMIT $${index}
      OFFSET $${index + 1};
    `;

    values.push(limit, offset);
    const { rows } = await pool.query(sql, values);

    // Convert DB fields -> frontend-friendly fields
    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
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
      FROM sessions s
      JOIN people patient ON s.patient_id = patient.id
      JOIN people staff   ON s.staff_id   = staff.id
      WHERE 1=1
        AND (
          s.name ILIKE $1
          OR patient.name ILIKE $1
          OR staff.name ILIKE $1
        )
    `;

    const countValues = [];
    countValues.push(`%${search}%`);
    let countIndex = 2;

    //put status into sql
    if (status !== undefined && status !== "") {
      countSql += ` AND s.status = $${countIndex}`;
      countValues.push(Number(status));
      countIndex++;
    }

    //put staffId into sql
    if (staffId !== undefined && staffId !== "") {
      countSql += ` AND s.staff_id = $${countIndex}`;
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

// get all sessions (MUI pagination)
router.get("/all", async (req, res) => {
  try {
    // filter
    const status = req.query.status;
    const staffId = req.query.staffId;
    const sortTime = req.query.sortTime === "asc" ? "ASC" : "DESC";

    // get search
    const search = req.query.search || "";

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
        AND (
          s.name ILIKE $1
          OR patient.name ILIKE $1
          OR staff.name ILIKE $1
        )
    `;

    const values = [];
    values.push(`%${search}%`);
    let index = 2;

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
      ORDER BY s.start_at ${sortTime}
    `;

    const { rows } = await pool.query(sql, values);

    // Convert DB fields -> frontend-friendly fields
    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
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

    res.json({ data });
  } catch (err) {
    console.error("GET /sessions/all error:", err);
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

    // get patient name
    const { rows: patientRow } = await pool.query(
      `
      SELECT name
      FROM people
      WHERE id=$1;
    `,
      [parsedPatientId],
    );

    const patientName = patientRow[0].name;
    // add this in recent actvities
    await insertRecentActivity(
      "session_created",
      `New session scheduled for ${patientName}`,
    );

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

    const parsedStatus = Number(status);

    if (![0, 1, 2].includes(parsedStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // check old status
    const checkOldStatusSql = `
      SELECT s.status, patient.name AS patient_name
      FROM sessions s
      JOIN people patient ON s.patient_id = patient.id
      WHERE s.id=$1;
    `;
    const { rows: oldRows } = await pool.query(checkOldStatusSql, [sessionId]);

    if (oldRows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const oldStatus = oldRows[0].status;
    const patientName = oldRows[0].patient_name;

    const sql = `
      UPDATE sessions
      SET name=$1, patient_id=$2, staff_id=$3, status=$4, start_at=$5, end_at=$6, updated_at = NOW()
      WHERE id=$7
      RETURNING *
    `;

    const { rows } = await pool.query(sql, [
      sessionName,
      parsedPatientId,
      parsedStaffId,
      parsedStatus,
      startAtWithZone,
      endAtWithZone,
      sessionId,
    ]);

    // add in recent activity
    await logSessionStatusChange(oldStatus, parsedStatus, patientName);

    res.json(rows[0]);
  } catch (err) {
    console.error("PUT /sessions/:id error:", err);
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

// change status of a session
router.patch("/:id/status", async (req, res) => {
  try {
    const sessionId = Number(req.params.id);
    const status = Number(req.body.status);

    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    if (![0, 1, 2].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // check old status
    const checkOldStatusSql = `
      SELECT s.status, patient.name AS patient_name
      FROM sessions s
      JOIN people patient ON s.patient_id = patient.id
      WHERE s.id=$1;
    `;
    const { rows: oldRows } = await pool.query(checkOldStatusSql, [sessionId]);

    if (oldRows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const oldStatus = oldRows[0].status;
    const patientName = oldRows[0].patient_name;

    const sql = `
      UPDATE sessions
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(sql, [status, sessionId]);

    // add in recent activity
    await logSessionStatusChange(oldStatus, status, patientName);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("PATCH /sessions/:id/status error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
