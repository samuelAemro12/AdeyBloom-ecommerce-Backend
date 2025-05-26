import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    updateNotificationPreferences
} from '../controllers/wishlist.controller.js';

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateToken, getWishlist);

// Add product to wishlist
router.post('/add/:productId', authenticateToken, addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', authenticateToken, removeFromWishlist);

// Move product from wishlist to cart
router.post('/move-to-cart/:productId', authenticateToken, moveToCart);

// Update notification preferences for a wishlist item
router.patch('/notifications/:productId', authenticateToken, updateNotificationPreferences);

export default router; 