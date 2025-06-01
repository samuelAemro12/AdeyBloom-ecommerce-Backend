import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import {
    createOrder,
    getUserOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    requestRefund
} from '../controllers/order.controller.js';

const router = express.Router();

// Create new order
router.post('/', protect, createOrder);

// Get user's orders
router.get('/my-orders', protect, getUserOrders);

// Get single order
router.get('/:orderId', protect, getOrder);

// Update order status (admin only)
router.patch('/:orderId/status', protect, admin, updateOrderStatus);

// Cancel order
router.post('/:orderId/cancel', protect, cancelOrder);

// Request refund
router.post('/:orderId/refund', protect, requestRefund);

export default router; 