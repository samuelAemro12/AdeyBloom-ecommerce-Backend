import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/update/:productId', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.delete('/clearAllFromCart', clearCart);



export default router; 