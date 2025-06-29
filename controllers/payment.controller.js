import asyncHandler from 'express-async-handler';
import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import axios from 'axios';

// Initialize Chapa with your secret key
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_BASE_URL = 'https://api.chapa.co/v1';

// Initialize payment
const initializePayment = asyncHandler(async (req, res) => {
    const { orderId, amount, currency = 'ETB', email, firstName, lastName, phone } = req.body;

    if (!orderId || !amount || !email) {
        res.status(400);
        throw new Error('Missing required fields: orderId, amount, email');
    }

    try {
        // Verify order exists
        const order = await Order.findById(orderId).populate('user');
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Create Chapa payment request
        const paymentData = {
            amount: amount.toString(),
            currency: currency,
            email: email,
            first_name: firstName || order.user.firstName || 'Customer',
            last_name: lastName || order.user.lastName || 'Name',
            phone: phone || order.user.phone || '',
            tx_ref: `order_${orderId}_${Date.now()}`,
            callback_url: `${process.env.CLIENT_URL}/payment-verification`,
            return_url: `${process.env.CLIENT_URL}/order-confirmation/${orderId}`,
            customizations: {
                title: 'Beauty Products E-commerce',
                description: `Payment for order #${orderId}`,
                logo: 'https://your-logo-url.com/logo.png'
            }
        };

        // Make request to Chapa API
        const response = await axios.post(
            `${CHAPA_BASE_URL}/transaction/initialize`,
            paymentData,
            {
                headers: {
                    'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status === 'success') {
            // Create payment record
            const payment = await Payment.create({
                order: orderId,
                user: order.user._id,
                paymentIntentId: response.data.data.reference,
                amount: amount,
                currency: currency,
                status: 'pending',
                provider: 'chapa'
            });

            res.status(200).json({
                success: true,
                message: 'Payment initialized successfully',
                data: {
                    checkoutUrl: response.data.data.checkout_url,
                    reference: response.data.data.reference,
                    paymentId: payment._id
                }
            });
        } else {
            res.status(400);
            throw new Error('Failed to initialize payment');
        }
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500);
        throw new Error(error.response?.data?.message || 'Payment initialization failed');
    }
});

// Verify payment
const verifyPayment = asyncHandler(async (req, res) => {
    const { reference } = req.params;

    if (!reference) {
        res.status(400);
        throw new Error('Payment reference is required');
    }

    try {
        // Verify payment with Chapa
        const response = await axios.get(
            `${CHAPA_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
                }
            }
        );

        if (response.data.status === 'success') {
            const paymentData = response.data.data;
            
            // Find and update payment record
            const payment = await Payment.findOne({ paymentIntentId: reference });
            if (!payment) {
                res.status(404);
                throw new Error('Payment record not found');
            }

            // Update payment status
            payment.status = paymentData.status === 'success' ? 'completed' : 'failed';
            payment.paidAt = new Date();
            await payment.save();

            // Update order status if payment is successful
            if (payment.status === 'completed') {
                await Order.findByIdAndUpdate(payment.order, {
                    status: 'paid',
                    paymentIntentId: reference
                });
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                data: {
                    status: payment.status,
                    amount: payment.amount,
                    currency: payment.currency,
                    orderId: payment.order
                }
            });
        } else {
            res.status(400);
            throw new Error('Payment verification failed');
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500);
        throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
});

// Webhook handler for Chapa
const webhookHandler = asyncHandler(async (req, res) => {
    const { event, data } = req.body;

    if (event === 'charge.success') {
        try {
            const payment = await Payment.findOne({ paymentIntentId: data.reference });
            if (payment) {
                payment.status = 'completed';
                payment.paidAt = new Date();
                await payment.save();

                // Update order status
                await Order.findByIdAndUpdate(payment.order, {
                    status: 'paid',
                    paymentIntentId: data.reference
                });
            }
        } catch (error) {
            console.error('Webhook processing error:', error);
        }
    }

    res.status(200).json({ received: true });
});

// Get payment status
const getPaymentStatus = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
        res.status(404);
        throw new Error('Payment not found');
    }

    res.status(200).json({
        success: true,
        data: {
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            orderId: payment.order._id,
            createdAt: payment.createdAt,
            paidAt: payment.paidAt
        }
    });
});

export {
    initializePayment,
    verifyPayment,
    webhookHandler,
    getPaymentStatus
}; 