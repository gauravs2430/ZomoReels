const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const agentRoutes = require("./routes/agent.routes");

const app = express();

// ─── CORS for AI Agent routes ──────────────────────────────────────────────
// /api/agent/* routes are public read-only endpoints called by the LiveKit
// agent server. That server is an external internet service, not our frontend,
// so we must allow any origin for ONLY these routes.
app.use("/api/agent", cors({ origin: "*" }));

// ─── CORS for browser (frontend) routes ───────────────────────────────────
// All other routes are only accessible from our configured frontend URL.
// credentials: true is required so HttpOnly JWT cookies are sent with requests.
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZOMOREELS API is running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/agent", agentRoutes);

module.exports = app;
