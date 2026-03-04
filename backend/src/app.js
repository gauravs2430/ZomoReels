const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");

const app = express();
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://reel-s-tyle-video-feed-integration.vercel.app"
  ],
  credentials: true
}));


app.use(cookieParser());
app.use(express.json());


app.get('/' , (req,res)=>{
    res.send("Hello World");
});
app.use("/api/auth" , authRoutes);
app.use("/api/food" , foodRoutes);


module.exports = app;

