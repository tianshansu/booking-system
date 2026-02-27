const express = require("express");
const router = express.Router();

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

module.exports = router;
