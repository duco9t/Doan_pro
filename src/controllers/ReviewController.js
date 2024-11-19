// controllers/productController.js
const Product = require("../models/ProductModel");

// Thêm đánh giá mới
const addReview = async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const { username, rating, comment } = req.body;
    console.log(productId, userId, username, rating, comment);
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ đánh giá và bình luận!" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    // Thêm đánh giá vào sản phẩm
    product.reviews.push({ userId, username, rating, comment });

    // Tính lại đánh giá trung bình
    const totalRatings = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const numReviews = product.reviews.length;
    product.averageRating = (totalRatings / numReviews).toFixed(2);

    // Tính phần trăm đánh giá
    const ratingCounts = [0, 0, 0, 0, 0];
    product.reviews.forEach((review) => ratingCounts[review.rating - 1]++);

    product.ratingPercentages = {
      oneStar: (ratingCounts[0] / numReviews) * 100,
      twoStar: (ratingCounts[1] / numReviews) * 100,
      threeStar: (ratingCounts[2] / numReviews) * 100,
      fourStar: (ratingCounts[3] / numReviews) * 100,
      fiveStar: (ratingCounts[4] / numReviews) * 100
    };

    await product.save();

    res.status(201).json({ message: "Thêm đánh giá thành công!", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin đánh giá
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate(
      "reviews.replies.userId",
      "username"
    );
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    res.status(200).json({
      reviews: product.reviews,
      averageRating: product.averageRating,
      ratingPercentages: product.ratingPercentages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReplyToReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { userId, username, comment } = req.body;
    console.log(productId, reviewId, userId, username, comment);
    if (!comment) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập nội dung trả lời!" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    // Tìm bình luận cần trả lời
    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy bình luận!" });
    }

    // Thêm trả lời vào bình luận
    review.replies.push({ userId, username, comment });

    await product.save();
    res.status(201).json({ message: "Trả lời thành công!", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getProductReviews, addReplyToReview };
