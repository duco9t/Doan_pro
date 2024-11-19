const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const session = require("express-session"); // Import express-session
// const fileUpload = require("express-fileupload");

dotenv.config();

const configLoginWithGoogle = require("./controllers/GoogleController");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "*" }));

// app.use(fileUpload());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Thay bằng khóa bí mật
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Đặt secure: true khi dùng HTTPS
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Google OAuth Config
configLoginWithGoogle();

// Server
app.listen(port, () => {
  console.log("Server is running on port", port);
});
