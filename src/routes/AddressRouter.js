const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/AddressController");

// Routes
router.post("/create", AddressController.createAddress);
router.get("/list/:userId", AddressController.getAddresses);

module.exports = router;
