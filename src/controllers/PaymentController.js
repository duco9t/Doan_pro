const PaymentService = require('../services/PaymentService');

const PaymentController = {
    async createPayment(req, res) {
        try {
            const { orderId, returnUrl } = req.body;
            
            // Gọi dịch vụ tạo URL thanh toán VNPay
            const paymentURL = await PaymentService(orderId, returnUrl);
            
            // Trả về URL thanh toán dưới dạng JSON thay vì chuyển hướng
            res.status(200).json({
                paymentURL: paymentURL
            });
        } catch (error) {
            console.error('Lỗi khi tạo URL thanh toán:', error.message);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo URL thanh toán',
                error: error.message
            });
        }
    }
};

module.exports = PaymentController;
