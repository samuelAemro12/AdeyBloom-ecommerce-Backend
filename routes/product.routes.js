import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateProductStock,
  uploadImage
} from '../controllers/product.controller.js';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post('/', authenticateToken, isAdmin, createProduct);
router.put('/:id', authenticateToken, isAdmin, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);
router.get('/inventory/low-stock', authenticateToken, isAdmin, getLowStockProducts);
router.patch('/:id/stock', authenticateToken, isAdmin, updateProductStock);

// Public route for image upload
router.post('/upload-image', upload.single('image'), uploadImage);

export default router; 