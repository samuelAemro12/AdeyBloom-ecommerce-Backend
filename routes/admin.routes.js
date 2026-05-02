import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import { 
    getDashboardStats, 
    getAllUsers, 
    createUser,
    updateUser,
    getAllOrders, 
    getAdminProducts,
    updateOrderStatus,
    updateUserRole,
    deleteUser,
    toggleUserActive,
    getSettings,
    updateSettings
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, isAdmin);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// User management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/active', toggleUserActive);
router.delete('/users/:id', deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Product management
router.get('/products', getAdminProducts);

export default router;
