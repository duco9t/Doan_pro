const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema]
});

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

    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    ratingPercentages: {
      oneStar: { type: Number, default: 0 },
      twoStar: { type: Number, default: 0 },
      threeStar: { type: Number, default: 0 },
      fourStar: { type: Number, default: 0 },
      fiveStar: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
