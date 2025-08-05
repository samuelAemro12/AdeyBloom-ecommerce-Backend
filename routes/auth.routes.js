import express from 'express';
import { register, login, logout, getMe, registerAdmin } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);
router.post('/register-admin', registerAdmin);

export default router; 
