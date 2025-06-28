import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';
import asyncHandler from 'express-async-handler';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
        .populate('products.product', 'name price images stock onSale');

    if (!wishlist) {
        return res.status(200).json({ products: [] });
    }

    res.status(200).json(wishlist);
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { notifyOnSale, notifyOnStock } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        // Create new wishlist if it doesn't exist
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [{
                product: productId,
                notifyOnSale: notifyOnSale || false,
                notifyOnStock: notifyOnStock || false
            }]
        });
    } else {
        // Check if product is already in wishlist
        const productExists = wishlist.products.some(
            item => item.product.toString() === productId
        );

        if (productExists) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }

        // Add product to wishlist
        wishlist.products.push({
            product: productId,
            notifyOnSale: notifyOnSale || false,
            notifyOnStock: notifyOnStock || false
        });
        await wishlist.save();
    }

    res.status(200).json(wishlist);
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(
        item => item.product.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json(wishlist);
});

// @desc    Move product from wishlist to cart
// @route   POST /api/wishlist/move-to-cart/:productId
// @access  Private
const moveToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.stock < quantity) {
        res.status(400);
        throw new Error('Not enough stock available');
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, products: [] });
    }

    // Add product to cart
    const existingItem = cart.products.find(
        item => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.products.push({ product: productId, quantity });
    }

    await cart.save();

    // Remove from wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
        wishlist.products = wishlist.products.filter(
            item => item.product.toString() !== productId
        );
        await wishlist.save();
    }

    res.status(200).json({ message: 'Product moved to cart successfully' });
});

// @desc    Update notification preferences for a wishlist item
// @route   PATCH /api/wishlist/notifications/:productId
// @access  Private
const updateNotificationPreferences = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { notifyOnSale, notifyOnStock } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    const productItem = wishlist.products.find(
        item => item.product.toString() === productId
    );

    if (!productItem) {
        res.status(404);
        throw new Error('Product not found in wishlist');
    }

    if (notifyOnSale !== undefined) {
        productItem.notifyOnSale = notifyOnSale;
    }
    if (notifyOnStock !== undefined) {
        productItem.notifyOnStock = notifyOnStock;
    }

    await wishlist.save();
    res.status(200).json(wishlist);
});

export {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    updateNotificationPreferences
}; 