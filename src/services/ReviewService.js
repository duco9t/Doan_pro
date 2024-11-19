const Product = require("../models/ProductModel");

// Thêm đánh giá mới
const addReview = async (productId, userId, username, rating, comment) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }

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
  return product;
};

// Lấy thông tin đánh giá
const getProductReviews = async (productId) => {
  const product = await Product.findById(productId).populate(
    "reviews.replies.userId",
    "username"
  );
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }

  return {
    reviews: product.reviews,
    averageRating: product.averageRating,
    ratingPercentages: product.ratingPercentages
  };
};

// Thêm trả lời vào bình luận
const addReplyToReview = async (
  productId,
  reviewId,
  userId,
  username,
  comment
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }

  const review = product.reviews.id(reviewId);
  if (!review) {
    throw new Error("Không tìm thấy bình luận!");
  }

  review.replies.push({ userId, username, comment });

  await product.save();
  return product;
};

module.exports = { addReview, getProductReviews, addReplyToReview };
