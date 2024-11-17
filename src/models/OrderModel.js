const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
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
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    address: { type: String},
    city: { type: String },
    country: { type: String}
  },
  totalPrice: { type: Number},
  shippingFee: { type: Number, default: 0 },
  orderTotal: { type: Number},
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });



const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
