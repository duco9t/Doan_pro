const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/VoucherController");

router.post("/create", voucherController.createVoucher); // API tạo voucher

module.exports = router;