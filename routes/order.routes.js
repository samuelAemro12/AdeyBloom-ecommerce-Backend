import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import {
    createOrder,
    getUserOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

// Create new order
router.post('/', authenticateToken, createOrder);

// Get user's orders
router.get('/my-orders', authenticateToken, getUserOrders);

// Get single order
router.get('/:orderId', authenticateToken, getOrder);

// Update order status (admin only)
router.patch('/:orderId/status', authenticateToken, isAdmin, updateOrderStatus);

// Cancel order
router.post('/:orderId/cancel', authenticateToken, cancelOrder);

export default router; 