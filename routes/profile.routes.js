import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getShippingAddresses
} from '../controllers/profile.controller.js';

const router = express.Router();

// All profile routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/', getProfile);
router.patch('/', updateProfile);
router.patch('/change-password', changePassword);

// Shipping address routes
router.get('/shipping-addresses', getShippingAddresses);
router.post('/shipping-addresses', addShippingAddress);
router.patch('/shipping-addresses/:addressId', updateShippingAddress);
router.delete('/shipping-addresses/:addressId', deleteShippingAddress);

export default router; 