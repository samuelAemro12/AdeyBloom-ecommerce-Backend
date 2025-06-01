import Order from '../models/order.model.js';
import OrderItem from '../models/orderItem.model.js';
import Cart from '../models/cart.model.js';
import Refund from '../models/refund.model.js';

// Create new order
export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total amount
        const totalAmount = cart.products.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        // Create order items
        const orderItems = await Promise.all(
            cart.products.map(async (item) => {
                const orderItem = new OrderItem({
                    product: item.product._id,
                    quantity: item.quantity,
                    priceAtPurchase: item.product.price
                });
                await orderItem.save();
                return orderItem._id;
            })
        );

        // Create order
        const order = new Order({
            user: userId,
            orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'pending'
        });

        await order.save();

        // Clear the cart
        cart.products = [];
        await cart.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: await order.populate('orderItems')
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product'
                }
            })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get single order
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        }).populate({
            path: 'orderItems',
            populate: {
                path: 'product'
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        await order.save();
        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending orders can be cancelled' });
        }

        order.status = 'cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling order', error: error.message });
    }
};

// Request refund
export const requestRefund = async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'delivered') {
            return res.status(400).json({ message: 'Only delivered orders can be refunded' });
        }

        // Check if refund already exists
        const existingRefund = await Refund.findOne({ order: order._id });
        if (existingRefund) {
            return res.status(400).json({ message: 'Refund request already exists for this order' });
        }

        const refund = new Refund({
            order: order._id,
            user: req.user._id,
            reason,
            status: 'pending'
        });

        await refund.save();

        res.status(201).json({
            message: 'Refund request submitted successfully',
            refund
        });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting refund', error: error.message });
    }
}; 