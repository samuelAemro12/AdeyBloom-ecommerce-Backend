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
import connectDB from './config/db.js';
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

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

// Allow multiple origins for CORS with priority: production (CLIENT_URL) first, then local fallback
const normalizeOrigin = (o) => {
    if (!o) return null;
    let trimmed = o.trim();
    // Remove trailing slash for consistency
    if (trimmed.endsWith('/')) trimmed = trimmed.slice(0, -1);
    return trimmed;
};

const prodOrigin = normalizeOrigin(process.env.CLIENT_URL);
const localOrigin = normalizeOrigin(process.env.CLIENT_URL_LOCAL);

let allowedOrigins = [];
if (prodOrigin) allowedOrigins.push(prodOrigin);
if (localOrigin && localOrigin !== prodOrigin) allowedOrigins.push(localOrigin);

// Backward compatibility: if CLIENT_URLS is set, append (but keep earlier priority order)
if (process.env.CLIENT_URLS) {
    const extra = process.env.CLIENT_URLS.split(',').map(normalizeOrigin).filter(Boolean);
    for (const e of extra) {
        if (!allowedOrigins.includes(e)) allowedOrigins.push(e);
    }
}

// Fallback default if nothing provided
if (allowedOrigins.length === 0) {
    allowedOrigins = ['http://localhost:5173'];
}

console.log('[CORS] Allowed origins (priority order):', allowedOrigins);

// Production assertion: ensure primary client origin is configured
if (process.env.NODE_ENV === 'production') {
    const expectedNetlify = 'https://adeybloom-ecommerce-client.netlify.app/';
    const hasConfiguredProd = !!prodOrigin;
    const listContainsNetlify = allowedOrigins.includes(expectedNetlify);

    if (!hasConfiguredProd) {
        console.error('[CORS][ASSERT] CLIENT_URL is not set in production environment.');
    }

    if (!listContainsNetlify) {
        // If user forgot to set but we can infer the expected domain, we can either inject or fail.
        console.warn('[CORS][WARN] Expected Netlify origin not present. Injecting fallback temporarily:', expectedNetlify);
        allowedOrigins.unshift(expectedNetlify);
    }

    // Re-log after potential injection
    console.log('[CORS] Final enforced origins:', allowedOrigins);

    // Hard fail if still misconfigured (no prod origin at index 0)
    if (allowedOrigins[0] !== expectedNetlify) {
        console.error('[CORS][FATAL] Production origin misconfigured. Set CLIENT_URL to', expectedNetlify, 'and redeploy.');
        // Optionally exit: uncomment next line to enforce hard stop
        process.exit(1);
    }
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, SSR server-to-server)
        if (!origin) return callback(null, true);
        if (!allowedOrigins.includes(origin)) {
            const msg = `[CORS] Origin not allowed: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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
