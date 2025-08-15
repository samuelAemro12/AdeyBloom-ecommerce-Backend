import Order from '../models/order.model.js';
import OrderItem from '../models/orderItem.model.js';
import Cart from '../models/cart.model.js';

// Create new order
export const createOrder = async (req, res) => {
    try {
        console.log('Order creation request:', {
            body: req.body,
            userId: req.user._id,
            user: req.user
        });

        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        console.log('Cart found:', {
            cartExists: !!cart,
            cartProducts: cart?.products?.length || 0,
            cartProducts: cart?.products
        });

        if (!cart || cart.products.length === 0) {
            console.log('Cart is empty or not found');
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Validate cart items have required data
        for (let item of cart.products) {
            if (!item.product || !item.product._id || !item.quantity) {
                console.error('Invalid cart item:', item);
                return res.status(400).json({ 
                    message: 'Invalid cart item data. Please refresh your cart and try again.' 
                });
            }
        }

        // Calculate subtotal
        const subtotal = cart.products.reduce((total, item) => {
            const price = item.product?.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);

        console.log('Calculations:', { subtotal, cartProducts: cart.products.length });

        // Calculate shipping and tax
        const shippingCost = 150; // ETB
        const taxRate = 0.15; // 15%
        const tax = subtotal * taxRate;
        const totalAmount = subtotal + shippingCost + tax;

        console.log('Order calculations:', { subtotal, shippingCost, tax, totalAmount });

        // Create order items
        const orderItems = await Promise.all(
            cart.products.map(async (item) => {
                console.log('Creating order item:', { 
                    productId: item.product._id, 
                    quantity: item.quantity, 
                    price: item.product.price 
                });
                const orderItem = new OrderItem({
                    product: item.product._id,
                    quantity: item.quantity,
                    priceAtPurchase: item.product.price
                });
                await orderItem.save();
                return orderItem._id;
            })
        );

        console.log('Order items created:', orderItems.length);

        // Create order
        const order = new Order({
            user: userId,
            orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'pending',
            currency: 'ETB'
        });

        console.log('Saving order:', { orderId: order._id, totalAmount, paymentMethod });

        await order.save();

        // Clear the cart
        cart.products = [];
        await cart.save();

        console.log('Cart cleared');

        // Populate order items with product details for response
        const populatedOrder = await order.populate({
            path: 'orderItems',
            populate: {
                path: 'product'
            }
        });

        console.log('Order created successfully:', populatedOrder._id);

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                ...populatedOrder.toObject(),
                subtotal,
                shippingCost,
                tax
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Error creating order', 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
        res.status(500).json({ message: 'Error canceling order', error: error.message });
    }
};