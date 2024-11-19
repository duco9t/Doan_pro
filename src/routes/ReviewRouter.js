const express = require("express");
const ReviewController = require("../controllers/ReviewController");

const router = express.Router();

router.post("/:productId/add-review/:userId", ReviewController.addReview);
router.get("/get-review/:productId", ReviewController.getProductReviews);
router.post(
  "/:productId/review/:reviewId/add-reply",
  ReviewController.addReplyToReview
);

module.exports = router;
