require("dotenv").config();

const express = require("express");
const cors = require("cors");
const peopleRoutes = require("./routes/peopleRoutes");
const sessionsRoutes = require("./routes/sessionsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware"); //check login

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/people", authMiddleware, peopleRoutes);
app.use("/api/sessions", authMiddleware, sessionsRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

app.use("/api/auth", authRoutes);

app.listen(4000, () => {
  console.log("Backend running: http://localhost:4000");
});
