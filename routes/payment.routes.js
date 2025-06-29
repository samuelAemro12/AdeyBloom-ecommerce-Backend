import express from 'express';
import { 
    initializePayment, 
    verifyPayment, 
    getPaymentStatus 
} from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Initialize payment (requires authentication)
router.post('/initialize', authenticateToken, initializePayment);

// Verify payment (public route for callbacks)
router.get('/verify/:reference', verifyPayment);

// Get payment status (requires authentication)
router.get('/status/:paymentId', authenticateToken, getPaymentStatus);

export default router; 