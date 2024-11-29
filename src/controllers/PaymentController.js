const PaymentService = require("../services/PaymentService");

const PaymentController = {
  async createPayment(req, res) {
    try {
      const { orderId, returnUrl } = req.body;

      const paymentURL = await PaymentService(orderId, returnUrl);

      res.status(200).json({
        paymentURL: paymentURL
      });
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error.message);
      res.status(500).json({
        success: false,
        message: "Lỗi khi tạo URL thanh toán",
        error: error.message
      });
    }
  }
};

module.exports = PaymentController;
