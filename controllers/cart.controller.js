import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('products.product', 'name price images stock');

    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists and has enough stock
    const product = await Product.findOne({ _id: productId, active: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
    }

    // Check if product already exists in cart
    const existingProductIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Update quantity if product exists
      const newQuantity = cart.products[existingProductIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      
      cart.products[existingProductIndex].quantity = newQuantity;
    } else {
      // Add new product to cart
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    
    cart = await cart.populate('products.product', 'name price images stock');
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Validate product exists and has enough stock
    const product = await Product.findOne({ _id: productId, active: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await cart.populate('products.product', 'name price images stock');
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await cart.populate('products.product', 'name price images stock');
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 


export const clearAllFromCart = async (req, res) => {
  try {

    // Set products to empty array for all carts
    await Cart.updateMany({}, { $set: { products: [] } });

    res.json({ message: 'All carts cleared successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
