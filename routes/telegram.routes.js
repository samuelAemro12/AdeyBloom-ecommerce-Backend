import express from 'express';
import { telegramAuth, telegramAddToCart, telegramGetCart } from '../controllers/telegram.controller.js';

const router = express.Router();

// POST /api/telegram/auth
router.post('/auth', telegramAuth);

// POST /api/telegram/cart/add
router.post('/cart/add', telegramAddToCart);

// GET /api/telegram/cart/:telegram_id
router.get('/cart/:telegram_id', telegramGetCart);

export default router;
