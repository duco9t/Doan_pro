const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const session = require("express-session");
const configLoginWithGoogle = require("./controllers/GoogleController");
const MongoDBStore = require("connect-mongodb-session")(session);

dotenv.config();

const app = express();

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://dacn-rose.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
      return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session configuration
// Kết nối MongoDB
const store = new MongoDBStore({
  uri: process.env.MONGO_DB,  // Đọc từ .env
  collection: "sessions",
});

app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { 
      secure: true,  // Bật nếu dùng HTTPS
      httpOnly: true,
      sameSite: "none"  // Cho phép cross-site cookies
  }
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Config
configLoginWithGoogle();

// Routes
routes(app);

// Database Connection
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connect DB success");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

  console.log("SECRET_OTP_TOKEN:", process.env.SECRET_OTP_TOKEN);

// 🚨 Không dùng app.listen(), mà export Express app
module.exports = app;
