import Review from '../models/review.model.js';

// Public: Get recent reviews site-wide
export const getRecentReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name')
      .populate('product', 'name');

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { getRecentReviews };
