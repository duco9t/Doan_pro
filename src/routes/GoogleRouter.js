const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://dacn-production.up.railway.app/login"
  }),
  (req, res) => {
    res.redirect(
      `https://dacn-production.up.railway.app?user=${encodeURIComponent(
        JSON.stringify(req.user)
      )}`
    );
  }
);

router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("https://dacn-production.up.railway.app");
  });
});

module.exports = router;
