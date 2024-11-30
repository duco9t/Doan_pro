const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ],
    shippingAddress: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    totalPrice: { type: Number },
    shippingFee: { type: Number, default: 0 },
    VAT: { type: Number, default: 0 },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher" // Tham chiếu đến model Voucher
    },
    orderTotal: { type: Number },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },
    isPaid: {
      type: Boolean,
      default: false, // Trạng thái thanh toán, mặc định là chưa thanh toán
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
