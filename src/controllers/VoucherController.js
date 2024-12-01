const VoucherService = require("../services/VoucherService"); // Import service
const Voucher = require("../models/VoucherModel");

const createVoucher = async (req, res) => {
  try {
    const { code, discount } = req.body;

    // Kiểm tra tất cả các trường có tồn tại không
    if (!code || !discount) {
      return res.status(400).json({
        status: "ERR",
        message: "Mã voucher và phần trăm giảm giá là bắt buộc"
      });
    }

    // Kiểm tra voucher đã tồn tại chưa
    const existingVoucher = await Voucher.findOne({ code });
    if (existingVoucher) {
      return res.status(400).json({
        status: "ERR",
        message: "Voucher đã tồn tại với mã này"
      });
    }

    // Tạo voucher mới thông qua service
    const response = await VoucherService.createVoucher(req.body);

    // Kiểm tra phản hồi từ service
    if (response.status === "ERR") {
      return res.status(400).json(response);
    }

    // Trả về voucher mới đã tạo
    return res.status(201).json(response);
  } catch (e) {
    // Xử lý lỗi nếu có
    return res.status(500).json({
      status: "ERR",
      message: "Đã có lỗi xảy ra khi tạo voucher: " + e.message
    });
  }
};

module.exports = {
  createVoucher
};
