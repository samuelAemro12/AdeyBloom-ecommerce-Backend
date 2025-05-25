import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder
} from '../controllers/order.controller.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// User routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:orderId', getOrderDetails);
router.patch('/:orderId/cancel', cancelOrder);

// Admin routes
router.patch('/:orderId/status', isAdmin, updateOrderStatus);

export default router; 