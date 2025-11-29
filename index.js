import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import orderRoutes from './routes/order.routes.js';
import categoryRoutes from './routes/category.routes.js';
import contactRoutes from './routes/contact.routes.js';
import adminRoutes from './routes/admin.routes.js';
import reviewRoutes from './routes/review.routes.js';
import telegramRoutes from './routes/telegram.routes.js';
import connectDB from './config/db.js';
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// let Express know it's behind a proxy (required for secure cookies on many hosts)
app.set('trust proxy', 1);

// Middleware
app.use(helmet()); // Security headers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Allow multiple origins for CORS
const allowedOrigins = [
  (process.env.CLIENT_URL || 'https://adeybloom-ecommerce-client.netlify.app').replace(/\/$/, ''),
  (process.env.CLIENT_URL_LOCAL || 'http://localhost:5173').replace(/\/$/, '')
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/telegram', telegramRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Beauty Products E-commerce API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to DB:', err);
});
