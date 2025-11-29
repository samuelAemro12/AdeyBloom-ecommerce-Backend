import express from 'express';
import {
  telegramAuth,
  telegramGetCart,
  telegramAddToCart,
  telegramRemoveFromCart,
  telegramClearCart
} from '../controllers/telegram.controller.js';

const router = express.Router();

// Simple index for convenience
router.get('/', (req, res) => {
  res.json({
    message: 'Telegram API endpoints',
    endpoints: [
      { method: 'POST', path: '/auth' },
      { method: 'POST', path: '/cart/add' },
      { method: 'POST', path: '/cart/remove' },
      { method: 'POST', path: '/cart/clear' },
      { method: 'GET', path: '/cart?telegram_id=...' },
      { method: 'GET', path: '/cart/:telegram_id' }
    ]
  });
});

router.post('/auth', telegramAuth);
router.get('/cart', telegramGetCart); // query ?telegram_id=...
router.get('/cart/:telegram_id', telegramGetCart); // param style
router.post('/cart/add', telegramAddToCart);
router.post('/cart/remove', telegramRemoveFromCart);
router.post('/cart/clear', telegramClearCart);

export default router;
