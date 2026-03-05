const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      message: "Session completed with Michael Chen",
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "New session scheduled for Amanda Foster",
      time: "5 hours ago",
    },
    {
      id: 3,
      message: "New person added - Amanda Foster",
      time: "6 hours ago",
    },
  ]);
});

router.get("/summary", async (req, res) => {
  try {
    const sql = `
      SELECT
        COUNT(*) FILTER (
          WHERE s.start_at::date = CURRENT_DATE
            AND s.status IN (0,1)
        ) AS today_count,

        COUNT(*) FILTER (
          WHERE s.start_at::date > CURRENT_DATE
            AND s.start_at::date < (CURRENT_DATE + INTERVAL '7 days')
            AND s.status = 0
        ) AS upcoming_count,

        COUNT(*) FILTER (
          WHERE s.status = 1
            AND s.start_at >= date_trunc('month', CURRENT_DATE)
            AND s.start_at <  (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')
        ) AS completed_count,
        
        (SELECT 
          COUNT(p.id) 
          FROM people p 
          WHERE p.status = 0
        ) AS active_people
      FROM sessions s;
    `;

    const { rows } = await pool.query(sql);

    const row = rows[0] || {
      today_count: 0,
      upcoming_count: 0,
      completed_count: 0,
      active_people: 0,
    };

    // Convert counts (often returned as strings by pg) to numbers
    const result = {
      today_count: Number(row.today_count) || 0,
      upcoming_count: Number(row.upcoming_count) || 0,
      completed_count: Number(row.completed_count) || 0,
      active_people: Number(row.active_people) || 0,
    };

    res.json(result);
  } catch (err) {
    console.error("GET /dashboard/summary error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
