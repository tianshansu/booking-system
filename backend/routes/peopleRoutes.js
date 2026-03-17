const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// get patients
router.get("/", async (req, res) => {
  try {
    // get current page & limit from query
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    // Get people + last past session date (only sessions before now)
    const dataSql = `
      SELECT
        p.id,
        p.name,
        p.email,
        p.phone,
        p.status,
        p.notes,
        MAX(s.start_at) AS last_session
      FROM people p
      LEFT JOIN sessions s
        ON s.patient_id = p.id
        AND s.start_at < NOW()
      WHERE p.role = 0
      GROUP BY p.id
      ORDER BY p.id
      LIMIT $1
      OFFSET $2;
    `;

    const { rows } = await pool.query(dataSql, [limit, offset]);

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

    // count total data
    const countSql = `
      SELECT COUNT(*) AS total
      FROM people
      WHERE role=0;
    `;

    const result = await pool.query(countSql);
    const total = Number(result.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({ data, page, limit, total, totalPages });
  } catch (err) {
    console.error("GET /people error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all patient names & ids
router.get("/patients/options", async (req, res) => {
  try {
    const sql = `
      SELECT id,name
      FROM people
      WHERE role=0
      ORDER BY name ASC
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("GET /people/patients/options error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all staff names & ids
router.get("/staff/options", async (req, res) => {
  try {
    const sql = `
      SELECT id,name
      FROM people
      WHERE role=1
      ORDER BY name ASC
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("GET /people/staff/options error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// add patient
router.post("/add-patient", async (req, res) => {
  try {
    // get values from req
    const { name, email, phone, notes } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    // add this people in db
    const sql = `
      INSERT INTO people (role, name, email, phone, status, notes)
      VALUES (0, $1, $2, $3, 0, $4)
      RETURNING *;
    `;
    const result = await pool.query(sql, [name, email, phone, notes]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /people/add-patient error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete patient
router.delete("/:id", async (req, res) => {
  try {
    // get person's id
    const personId = req.params.id;

    if (Number.isNaN(personId)) {
      return res.status(400).json({ error: "Invalid person id" });
    }

    const sql = `
      DELETE
      FROM people p
      where p.id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(sql, [personId]);

    // if no data returned
    if (rows.length === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.status(200).json({
      message: "Person deleted successfully",
      deletedId: rows[0].id,
    });
  } catch (err) {
    console.error("DELETE /people/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// edit patient
router.put("/:id", async (req, res) => {
  try {
    // get person id from params
    const personId = req.params.id;
    // get person new info from body
    const { name, email, phone, status, notes } = req.body;

    // check whether personId has been passed to backend
    if (Number.isNaN(personId)) {
      return res.status(400).json({ error: "Invalid person id" });
    }

    const sql = `
      UPDATE people
      SET 
        name=$1,
        email=$2,
        phone=$3,
        status=$4,
        notes=$5
      WHERE id=$6
      RETURNING id
    `;

    const { rows } = await pool.query(sql, [
      name,
      email,
      phone,
      status,
      notes,
      personId,
    ]);
    res.json(rows[0].id);
  } catch (err) {
    console.error("PUT /people/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
