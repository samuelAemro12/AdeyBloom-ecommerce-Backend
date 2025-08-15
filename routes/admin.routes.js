import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import { 
    getDashboardStats, 
    getAllUsers, 
    getAllOrders, 
    updateOrderStatus,
    updateUserRole,
    deleteUser,
    toggleUserActive
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, isAdmin);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/active', toggleUserActive);
router.delete('/users/:id', deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;