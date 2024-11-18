const timespan = require("jsonwebtoken/lib/timespan");

const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantityInStock: { type: Number, default: 0 },
    prices: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    bannerUrl: { type: String, default: "" },
    productsTypeName: { type: String, default: "" },
    inches: { type: String, default: "" },
    screenResolution: { type: String, default: "" },
    company: { type: String, default: "" },
    cpu: { type: String, default: "" },
    ram: { type: String, default: "" },
    memory: { type: String, default: "" },
    gpu: { type: String, default: "" },
    weight: { type: String, default: "" },
    opsys: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'}
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
