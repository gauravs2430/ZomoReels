const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");

const app = express();

// CORS — reads allowed origin from env variable.
// Development: http://localhost:5173
// Production:  https://your-app.vercel.app  (set in Render dashboard)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,   // REQUIRED: allows cookies to be sent from the browser
}));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZOMOREELS API is running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);

module.exports = app;
