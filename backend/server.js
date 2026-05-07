require("dotenv").config();

const express = require("express");
const cors = require("cors");

const peopleRoutes = require("./routes/peopleRoutes");
const sessionsRoutes = require("./routes/sessionsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware"); // check login

const app = express();

const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/people", authMiddleware, peopleRoutes);
app.use("/api/sessions", authMiddleware, sessionsRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
