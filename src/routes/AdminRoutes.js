const express = require("express");
const router = express.Router();
const {
  authAdminMiddleware,
  authUserMiddleware
} = require("../middleware/authMiddleware");

router.get("/admin", authAdminMiddleware, (req, res) => {
  res.send("Welcome to Admin Dashboard");
});
router.get("/user", authUserMiddleware, (req, res) => {
  res.send("Welcome to User Dashboard");
});

module.exports = router;
