import asyncHandler from 'express-async-handler';
import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import axios from 'axios';

// Initialize Chapa with test secret key only
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_BASE_URL = 'https://api.chapa.co/v1';

// Initialize payment (Test Mode Only)
const initializePayment = asyncHandler(async (req, res) => {
    const { orderId, amount, currency = 'ETB', email, firstName, lastName, phone } = req.body;

    if (!orderId || !amount || !email) {
        res.status(400);
        throw new Error('Missing required fields: orderId, amount, email');
    }

    // Validate that we're using test key
    if (!CHAPA_SECRET_KEY || !CHAPA_SECRET_KEY.startsWith('CHASECK_TEST-')) {
        res.status(500);
        throw new Error('Test mode only: Please use CHASECK_TEST- key');
    }

    try {
        // Verify order exists
        const order = await Order.findById(orderId).populate('user');
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Create Chapa payment request (Test Mode)
        const paymentData = {
            amount: amount.toString(),
            currency: currency,
            email: email,
            first_name: firstName || order.user.name?.split(' ')[0] || 'Test',
            last_name: lastName || order.user.name?.split(' ').slice(1).join(' ') || 'Customer',
            phone: phone || '+251900000000',
            tx_ref: `test_order_${orderId}_${Date.now()}`,
            callback_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-verification`,
            return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-confirmation/${orderId}`,
            customizations: {
                title: 'Beauty Products E-commerce (Test)',
                description: `Test payment for order #${orderId}`,
                logo: 'https://your-logo-url.com/logo.png'
            }
        };

        console.log('🧪 Test Payment Request:', paymentData);

        // Make request to Chapa API (Test Mode)
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
                provider: 'chapa_test'
            });

            console.log('✅ Test Payment Initialized:', response.data.data.reference);

            res.status(200).json({
                success: true,
                message: 'Test payment initialized successfully',
                data: {
                    checkoutUrl: response.data.data.checkout_url,
                    reference: response.data.data.reference,
                    paymentId: payment._id
                }
            });
        } else {
            res.status(400);
            throw new Error('Failed to initialize test payment');
        }
    } catch (error) {
        console.error('Test Payment initialization error:', error);
        res.status(500);
        throw new Error(error.response?.data?.message || 'Test payment initialization failed');
    }
});

// Verify payment (Test Mode Only)
const verifyPayment = asyncHandler(async (req, res) => {
    const { reference } = req.params;

    if (!reference) {
        res.status(400);
        throw new Error('Payment reference is required');
    }

    try {
        // Verify payment with Chapa (Test Mode)
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

            // Update payment status (Test Mode - always mark as completed for demo)
            payment.status = 'completed';
            payment.paidAt = new Date();
            await payment.save();

            // Update order status
            await Order.findByIdAndUpdate(payment.order, {
                status: 'paid',
                paymentIntentId: reference
            });

            console.log('✅ Test Payment Verified:', reference);

            res.status(200).json({
                success: true,
                message: 'Test payment verified successfully',
                data: {
                    status: payment.status,
                    amount: payment.amount,
                    currency: payment.currency,
                    orderId: payment.order
                }
            });
        } else {
            res.status(400);
            throw new Error('Test payment verification failed');
        }
    } catch (error) {
        console.error('Test Payment verification error:', error);
        res.status(500);
        throw new Error(error.response?.data?.message || 'Test payment verification failed');
    }
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
    getPaymentStatus
}; 