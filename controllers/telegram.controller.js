import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import bcrypt from 'bcryptjs';

// Simple telegram auth: find or create user by telegram_id
export const telegramAuth = async (req, res) => {
  try {
    const { telegram_id, first_name } = req.body;
    if (!telegram_id) return res.status(400).json({ message: 'telegram_id is required' });

    let user = await User.findOne({ telegram_id });
    if (!user) {
      // Create a minimal user record satisfying schema required fields.
      // Use a synthetic email and a randomly-generated password hash so
      // existing auth flows aren't broken.
      const syntheticEmail = `telegram_${telegram_id}@telegram.local`;
      const randomPassword = Math.random().toString(36).slice(2, 12);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        telegram_id,
        name: first_name || 'Telegram User',
        email: syntheticEmail,
        passwordHash,
        role: 'customer',
      });
    }

    // Don't return sensitive fields
    const safeUser = {
      id: user._id,
      name: user.name,
      role: user.role,
      telegram_id: user.telegram_id,
    };

    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add item to cart using telegram_id instead of authenticated user
export const telegramAddToCart = async (req, res) => {
  try {
    const { telegram_id, product_id, quantity = 1 } = req.body;
    if (!telegram_id || !product_id) return res.status(400).json({ message: 'telegram_id and product_id are required' });

    // Find or create user record for this telegram_id
    let user = await User.findOne({ telegram_id });
    if (!user) {
      const syntheticEmail = `telegram_${telegram_id}@telegram.local`;
      const randomPassword = Math.random().toString(36).slice(2, 12);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await User.create({ telegram_id, name: 'Telegram User', email: syntheticEmail, passwordHash, role: 'customer' });
    }

    const product = await Product.findOne({ _id: product_id, active: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock available' });

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, products: [] });
    }

    const existingIndex = cart.products.findIndex(p => p.product.toString() === product_id);
    if (existingIndex > -1) {
      const newQty = cart.products[existingIndex].quantity + quantity;
      if (newQty > product.stock) return res.status(400).json({ message: 'Not enough stock available' });
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

// Get cart by telegram_id
export const telegramGetCart = async (req, res) => {
  try {
    const { telegram_id } = req.params;
    if (!telegram_id) return res.status(400).json({ message: 'telegram_id is required' });

    const user = await User.findOne({ telegram_id });
    if (!user) return res.status(404).json({ message: 'User not found' });

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
