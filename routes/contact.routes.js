import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import {
    submitContact,
    getAllContacts,
    getContact,
    updateContactStatus,
    deleteContact
} from '../controllers/contact.controller.js';

const router = express.Router();

// Public route - Submit contact form
router.post('/submit', submitContact);

// Admin routes - require authentication and admin role
router.get('/', authenticateToken, isAdmin, getAllContacts);
router.get('/:id', authenticateToken, isAdmin, getContact);
router.patch('/:id/status', authenticateToken, isAdmin, updateContactStatus);
router.delete('/:id', authenticateToken, isAdmin, deleteContact);

export default router;
