import Review from '../models/review.model.js';

// Public: Get recent reviews site-wide
export const getRecentReviews = async (req, res) => {
  try {
    const limitParam = req.query.limit;
    console.debug('[getRecentReviews] limit param:', limitParam);
    const query = Review.find().sort({ createdAt: -1 }).populate('user', 'name').populate('product', 'name');
    let reviews;

    if (typeof limitParam !== 'undefined') {
      const limit = parseInt(limitParam, 10);
      if (!Number.isNaN(limit) && limit > 0) {
        reviews = await query.limit(limit);
      } else {
        // invalid limit provided — fall back to no limit
        reviews = await query;
      }
    } else {
      // no limit specified — return all reviews
      reviews = await query;
    }

    console.debug('[getRecentReviews] returning reviews count:', reviews.length);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: Get reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Protected: Add a review for a product (requires authenticateToken middleware)
export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const review = new Review({ user: userId, product: productId, rating, comment });
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Protected: Update a review (owner or admin)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    // Allow update if owner or admin
    if (String(review.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }
    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Protected: Delete a review (owner or admin)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (String(review.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }
    await review.remove();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { getRecentReviews };
