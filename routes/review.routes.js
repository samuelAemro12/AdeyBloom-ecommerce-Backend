import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getRecentReviews
} from '../controllers/review.controller.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/recent', getRecentReviews);

// Protected routes
router.use(authenticateToken);
router.post('/product/:productId', addReview);
router.patch('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

export default router; 