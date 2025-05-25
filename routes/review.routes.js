import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(authenticateToken);
router.post('/product/:productId', addReview);
router.patch('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

export default router; 