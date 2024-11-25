const express = require("express");
const router = express.Router();
const { authAdminMiddleware } = require("../middleware/authMiddleware");

router.get("/", authAdminMiddleware, (req, res) => {
  res.send("Welcome to Admin Dashboard");
});

module.exports = router;
