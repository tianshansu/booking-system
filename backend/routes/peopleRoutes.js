const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const multer = require("multer");
const { parse } = require("csv-parse/sync");
const upload = multer({ storage: multer.memoryStorage() });

async function insertRecentActivity(type, message) {
  await pool.query(
    `
    INSERT INTO recent_activity (type, message)
    VALUES ($1, $2);
  `,
    [type, message],
  );
}

// import people from csv
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    // check file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // convert file buffer to text
    const csvText = req.file.buffer.toString("utf-8");

    // parse csv text into rows
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const inserted = [];
    const failed = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];

      const name = row.name?.trim();
      const email = row.email?.trim();
      const phone = row.phone?.trim() || "";
      const notes = row.notes?.trim() || "";
      const roleText = row.role?.trim().toLowerCase();

      let roleValue;

      if (roleText === "patient") {
        roleValue = 0;
      } else if (roleText === "staff") {
        roleValue = 1;
      } else {
        failed.push({
          row: i + 2,
          error: "Invalid role",
        });
        continue;
      }

      // required field validation
      if (!name || !email) {
        failed.push({
          row: i + 2,
          error: "Name and email are required",
        });
        continue;
      }

      try {
        const result = await pool.query(
          `
          INSERT INTO people (name, email, phone, notes, role, status)
          VALUES ($1, $2, $3, $4, $5, 0)
          RETURNING id, name, email;
          `,
          [name, email, phone, notes, roleValue],
        );

        inserted.push(result.rows[0]);
      } catch (err) {
        failed.push({
          row: i + 2,
          error: "Database insert failed",
        });
      }
    }

    return res.status(200).json({
      message: "Import completed",
      insertedCount: inserted.length,
      failedCount: failed.length,
      failed,
    });
  } catch (err) {
    console.error("POST /people/import error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get people
router.get("/", async (req, res) => {
  try {
    // get role
    const role = req.query.role || "patient";

    // get filter values
    const filterStatus = req.query.filterStatus;
    const filterName = req.query.filterName === "desc" ? "DESC" : "ASC";

    let roleValue;
    if (role === "patient") {
      roleValue = 0;
    } else if (role === "staff") {
      roleValue = 1;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    // get search
    const search = req.query.search || "";

    // get current page & limit from query
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // Get people + last past session date (only sessions before now)
    let dataSql = `
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
      WHERE p.role = $1
        AND (
          p.name ILIKE $2
          OR p.email ILIKE $2
          OR p.phone ILIKE $2
        )
    `;

    if (filterStatus !== undefined && filterStatus !== "") {
      dataSql += ` AND p.status = ${Number(filterStatus)}`;
    }

    dataSql += `
      GROUP BY p.id
      ORDER BY p.name ${filterName}
      LIMIT $3
      OFFSET $4;
    `;

    const { rows } = await pool.query(dataSql, [
      roleValue,
      `%${search}%`,
      limit,
      offset,
    ]);

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
    let countSql = `
      SELECT COUNT(*) AS total
      FROM people
      WHERE role=$1
        AND (
          name ILIKE $2
          OR email ILIKE $2
          OR phone ILIKE $2
      )
    `;

    if (filterStatus !== undefined && filterStatus !== "") {
      countSql += ` AND status = ${Number(filterStatus)};`;
    }

    const result = await pool.query(countSql, [roleValue, `%${search}%`]);
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

// add person
router.post("/add-person", async (req, res) => {
  try {
    // get values from req
    const { role, name, email, phone, notes } = req.body;

    if (role !== "patient" && role !== "staff") {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    // transfer role into number
    let roleNum;
    if (role === "patient") {
      roleNum = 0;
    } else if (role === "staff") {
      roleNum = 1;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    // add this person in db
    const sql = `
      INSERT INTO people (role, name, email, phone, status, notes)
      VALUES ($1, $2, $3, $4, 0, $5)
      RETURNING *;
    `;
    const result = await pool.query(sql, [roleNum, name, email, phone, notes]);

    await insertRecentActivity("person_created", `New person added - ${name}`);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /people/add-person error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete person
router.delete("/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    // get person's id
    const personId = Number(req.params.id);

    if (!Number.isInteger(personId)) {
      return res.status(400).json({ error: "Invalid person id" });
    }

    // start transaction
    await client.query("BEGIN");

    // check if person exists
    const personResult = await client.query(
      `
      SELECT id
      FROM people
      WHERE id = $1
      `,
      [personId],
    );

    // if no data returned
    if (personResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Person not found" });
    }

    // delete related sessions first
    await client.query(
      `
      DELETE
      FROM sessions
      WHERE patient_id = $1 OR staff_id = $1
      `,
      [personId],
    );

    // delete person
    const deleteResult = await client.query(
      `
      DELETE
      FROM people
      WHERE id = $1
      RETURNING id
      `,
      [personId],
    );

    // commit transaction
    await client.query("COMMIT");

    res.status(200).json({
      message: "Person and related sessions deleted successfully",
      deletedId: deleteResult.rows[0].id,
    });
  } catch (err) {
    // rollback transaction if error happens
    await client.query("ROLLBACK");
    console.error("DELETE /people/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    // release connection back to pool
    client.release();
  }
});

// bulk delete
router.delete("/bulk-delete", async (req, res) => {
  //get people's ids
  const { ids } = req.body;
  const client = await pool.connect();

  try {
    // validate ids
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids is required" });
    }

    await client.query("BEGIN");

    // check if all people exist
    const peopleResult = await client.query(
      `
      SELECT id
      FROM people
      WHERE id = ANY($1)
      `,
      [ids],
    );

    if (peopleResult.rows.length !== ids.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Some people not found" });
    }

    // delete related sessions first
    await client.query(
      `
      DELETE
      FROM sessions
      WHERE patient_id = ANY($1) OR staff_id = ANY($1)
      `,
      [ids],
    );

    // delete people
    const deleteResult = await client.query(
      `
      DELETE
      FROM people
      WHERE id = ANY($1)
      RETURNING id
      `,
      [ids],
    );

    await client.query("COMMIT");

    return res.json({
      message: "People deleted successfully",
      deletedIds: deleteResult.rows.map((row) => row.id),
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("DELETE /people/bulk-delete error:", err);
    return res.status(500).json({ error: "Failed to delete people" });
  } finally {
    client.release();
  }
});

// edit person
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
        notes=$5,
        updated_at = NOW()
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
