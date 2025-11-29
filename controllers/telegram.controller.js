import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import bcrypt from 'bcryptjs';

// POST /api/telegram/auth
// Body: { telegram_id, first_name?, last_name? }
export const telegramAuth = async (req, res) => {
  try {
    const { telegram_id, first_name, last_name } = req.body;
    if (!telegram_id) return res.status(400).json({ success: false, message: 'telegram_id is required' });

    let user = await User.findOne({ telegram_id });
    if (!user) {
      // Create minimal user record so existing flows work
      const syntheticEmail = `telegram_${telegram_id}@telegram.local`;
      const randomPassword = Math.random().toString(36).slice(2, 12);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        telegram_id,
        name: first_name ? `${first_name}${last_name ? ' ' + last_name : ''}` : 'Telegram User',
        email: syntheticEmail,
        passwordHash,
        role: 'customer'
      });
    }

    // Ensure cart exists (optional but convenient)
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, products: [] });
      await cart.save();
    }

    const safeUser = {
      id: user._id,
      name: user.name,
      role: user.role,
      telegram_id: user.telegram_id
    };

    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/telegram/cart?telegram_id=...  OR  GET /api/telegram/cart/:telegram_id
export const telegramGetCart = async (req, res) => {
  try {
    const telegram_id = req.query.telegram_id || req.params.telegram_id;
    if (!telegram_id) return res.status(400).json({ success: false, message: 'telegram_id is required' });

    const user = await User.findOne({ telegram_id });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let cart = await Cart.findOne({ user: user._id }).populate('products.product', 'name price images stock');
    if (!cart) {
      cart = new Cart({ user: user._id, products: [] });
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/telegram/cart/add
// Body: { telegram_id, product_id, quantity }
export const telegramAddToCart = async (req, res) => {
  try {
    const { telegram_id, product_id, quantity = 1 } = req.body;
    if (!telegram_id || !product_id) return res.status(400).json({ success: false, message: 'telegram_id and product_id are required' });

    let user = await User.findOne({ telegram_id });
    if (!user) {
      // create minimal user
      const syntheticEmail = `telegram_${telegram_id}@telegram.local`;
      const randomPassword = Math.random().toString(36).slice(2, 12);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await User.create({ telegram_id, name: 'Telegram User', email: syntheticEmail, passwordHash, role: 'customer' });
    }

    const product = await Product.findOne({ _id: product_id, active: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Not enough stock available' });

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) cart = new Cart({ user: user._id, products: [] });

    const existingIndex = cart.products.findIndex(p => p.product.toString() === product_id);
    if (existingIndex > -1) {
      const newQty = cart.products[existingIndex].quantity + quantity;
      if (newQty > product.stock) return res.status(400).json({ success: false, message: 'Not enough stock available' });
      cart.products[existingIndex].quantity = newQty;
    } else {
      cart.products.push({ product: product_id, quantity });
    }

    await cart.save();
    cart = await cart.populate('products.product', 'name price images stock');

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/telegram/cart/remove
// Body: { telegram_id, product_id }
export const telegramRemoveFromCart = async (req, res) => {
  try {
    const { telegram_id, product_id } = req.body;
    if (!telegram_id || !product_id) return res.status(400).json({ success: false, message: 'telegram_id and product_id are required' });

    const user = await User.findOne({ telegram_id });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.products = cart.products.filter(item => item.product.toString() !== product_id);
    await cart.save();

    const updatedCart = await cart.populate('products.product', 'name price images stock');
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/telegram/cart/clear
// Body: { telegram_id }
export const telegramClearCart = async (req, res) => {
  try {
    const { telegram_id } = req.body;
    if (!telegram_id) return res.status(400).json({ success: false, message: 'telegram_id is required' });

    const user = await User.findOne({ telegram_id });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.products = [];
    await cart.save();

    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
