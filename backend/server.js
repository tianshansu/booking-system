require("dotenv").config();

const express = require("express");
const cors = require("cors");
const peopleRoutes = require("./routes/peopleRoutes");
const sessionsRoutes = require("./routes/sessionsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/people", peopleRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(4000, () => {
  console.log("Backend running: http://localhost:4000");
});
