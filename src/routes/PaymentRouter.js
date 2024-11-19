const express = require("express");
const router = express.Router();
const PaymentController = require ('../controllers/PaymentController');

router.post('/create_payment', PaymentController.createPayment)

module.exports = router;
