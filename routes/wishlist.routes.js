import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    updateNotificationPreferences
} from '../controllers/wishlist.controller.js';

const router = express.Router();

// Get user's wishlist
router.get('/', protect, getWishlist);

// Add product to wishlist
router.post('/add/:productId', protect, addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', protect, removeFromWishlist);

// Move product from wishlist to cart
router.post('/move-to-cart/:productId', protect, moveToCart);

// Update notification preferences for a wishlist item
router.patch('/notifications/:productId', protect, updateNotificationPreferences);

export default router; 