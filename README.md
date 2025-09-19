# 🌸 AdeyBloom - Beauty Products E-commerce Backend

A robust, scalable RESTful API backend for a beauty products e-commerce platform. Built with Node.js, Express.js, and MongoDB, designed specifically for the Ethiopian market with comprehensive features for product management, user authentication, order processing, and payment integration.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** - Secure token-based user authentication
- **Role-based Access Control** - Admin and customer role management
- **Password Security** - bcrypt hashing with salt rounds
- **Session Management** - HTTP-only cookie storage for tokens
- **Protected Routes** - Middleware-based route protection

### 🛍️ E-commerce Core Features
- **Product Management** - Complete CRUD operations with advanced filtering
- **Shopping Cart** - Persistent cart with real-time updates
- **Wishlist System** - Save and manage favorite products
- **Order Processing** - End-to-end order management with status tracking
- **Category Management** - Hierarchical product categorization
- **Inventory Tracking** - Stock management with low-stock alerts

### 📊 Advanced Business Features
- **Review & Rating System** - Customer feedback and product ratings
- **Promotion Engine** - Discount codes and promotional pricing
- **Contact Management** - Customer inquiry handling system
- **Email Notifications** - Automated email alerts and confirmations
- **Search & Filtering** - Advanced product search with multiple criteria
- **Analytics Ready** - Data structure optimized for business insights

### 🛡️ Security & Performance
- **Security Headers** - Helmet.js for security best practices
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Configuration** - Cross-origin resource sharing setup
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Centralized error management
- **Database Security** - MongoDB injection prevention

### ♻️ Resilience & Deployment Enhancements (Recent Changes)
- **Primary → Fallback Database Strategy**: Attempts MongoDB Atlas ( `MONGODB_URI` ) first; on failure automatically retries a local instance ( `MONGODB_URI_LOCAL` ).
- **Prioritized CORS Origins**: Production origin (`CLIENT_URL`) is evaluated first; local development origin (`CLIENT_URL_LOCAL`) is accepted as a fallback. Legacy `CLIENT_URLS` still supported.
- **Consistent API Base Path**: All public routes are mounted under `/api/*`. Frontend clients should point their base (without `/api`) and allow their HTTP layer to append it once (our frontend does automatic normalization now).
- **Review Aggregation**: Added site‑wide recent reviews endpoint plus product‑scoped review listing to power dynamic testimonial carousel.
- **Discount & Rating Enrichment**: Product responses can include derived rating, reviewCount, discount, and dynamic final price when promotions are active.

### ☁️ Cloud Integration
- **Cloudinary Integration** - Image upload and management
- **File Upload** - Multer-based file handling
- **Environment Configuration** - Secure environment variable management
- **Production Ready** - Optimized for deployment

## 🛠️ Tech Stack

### Core Technologies
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)

### Security & Middleware
- **Security:** Helmet.js, bcryptjs, express-rate-limit
- **CORS:** Cross-origin resource sharing
- **Cookies:** cookie-parser for session management
- **Validation:** Express validator middleware

### File & Email Services
- **File Upload:** Multer + Cloudinary
- **Email Service:** Nodemailer
- **Image Processing:** Cloudinary transformations

### Development Tools
- **Development:** Nodemon for hot reloading
- **Environment:** dotenv for configuration
- **HTTP Client:** Axios for external API calls

## 📁 Project Structure

```
beauty-product-ecommerce-Backend/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   ├── auth.controller.js     # User authentication logic
│   ├── cart.controller.js     # Shopping cart operations
│   ├── category.controller.js # Product category management
│   ├── contact.controller.js  # Customer contact handling
│   ├── order.controller.js    # Order processing & management
│   ├── product.controller.js  # Product CRUD operations
│   └── wishlist.controller.js # Wishlist functionality
├── middleware/
│   └── auth.middleware.js     # Authentication & authorization
├── models/
│   ├── cart.model.js          # Shopping cart schema
│   ├── category.model.js      # Product category schema
│   ├── contact.model.js       # Contact form schema
│   ├── order.model.js         # Order schema
│   ├── orderItem.model.js     # Order items schema
│   ├── product.model.js       # Product schema
│   ├── promotion.model.js     # Promotions & discounts
│   ├── review.model.js        # Product reviews
│   ├── user.model.js          # User account schema
│   └── wishlist.model.js      # Wishlist schema
├── routes/
│   ├── auth.routes.js         # Authentication endpoints
│   ├── cart.routes.js         # Cart management routes
│   ├── category.routes.js     # Category CRUD routes
│   ├── contact.routes.js      # Contact form routes
│   ├── order.routes.js        # Order processing routes
│   ├── product.routes.js      # Product management routes
│   ├── profile.routes.js      # User profile routes
│   ├── review.routes.js       # Review system routes
│   └── wishlist.routes.js     # Wishlist routes
├── uploads/                   # Temporary file uploads
├── .env                       # Environment variables
├── index.js                   # Application entry point
└── package.json              # Dependencies & scripts
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**
- **Cloudinary Account** (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beauty-product-ecommerce-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/beauty-ecommerce

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email Configuration (Nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Origins
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Verify installation**
   Navigate to `http://localhost:5000` - you should see:
   ```json
   {
     "message": "Welcome to Beauty Products E-commerce API"
   }
   ```

### Production Deployment

1. **Build for production**
   ```bash
   npm install --production
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

3. **Start production server**
  ```bash
  npm start
  ```

### Deployment / Resilience Notes
| Concern | Strategy |
|---------|----------|
| Database availability | Try Atlas first ( `MONGODB_URI` ). If connect fails, attempts `MONGODB_URI_LOCAL`. Clear console logs indicate which is active. |
| CORS | Normalizes and logs `[CORS] Allowed origins (priority order)` at startup so misconfigurations are visible immediately. |
| Image hosting | Cloudinary integrated; local `uploads/` only transient. |
| Auth cookies | Sent with `credentials: true`; ensure production origin + backend both use HTTPS and proper same-site settings (adjust if deploying over different subdomains). |
| 401 responses | Expected when unauthenticated clients hit protected endpoints—avoid treating as fatal in monitoring. |

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```http
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
POST   /api/auth/logout       # User logout
GET    /api/auth/me           # Get current user
```

### Product Endpoints
```http
GET    /api/products          # Get all products (with filtering)
GET    /api/products/:id      # Get single product
POST   /api/products          # Create product (Admin only)
PUT    /api/products/:id      # Update product (Admin only)
DELETE /api/products/:id      # Delete product (Admin only)
POST   /api/products/upload-image  # Upload product image
```

### Review Endpoints
```http
GET    /api/reviews/recent                 # Site-wide recent (or all) reviews (supports optional ?limit=)
GET    /api/reviews/product/:productId     # Reviews for a specific product
POST   /api/reviews/product/:productId     # (Auth) Add review
PATCH  /api/reviews/:reviewId              # (Auth + owner/admin) Update review
DELETE /api/reviews/:reviewId              # (Auth + owner/admin) Delete review
```

### Cart Endpoints
```http
GET    /api/cart              # Get user's cart
POST   /api/cart              # Add item to cart
PUT    /api/cart/:itemId      # Update cart item
DELETE /api/cart/:itemId      # Remove item from cart
DELETE /api/cart              # Clear entire cart
```

### Order Endpoints
```http
POST   /api/orders            # Create new order
GET    /api/orders/my-orders  # Get user's orders
GET    /api/orders/:orderId   # Get single order
PATCH  /api/orders/:orderId/status  # Update order status (Admin)
POST   /api/orders/:orderId/cancel  # Cancel order
```

### Wishlist Endpoints
```http
GET    /api/wishlist          # Get user's wishlist
POST   /api/wishlist          # Add item to wishlist
DELETE /api/wishlist/:itemId  # Remove item from wishlist
```

### Category Endpoints
```http
GET    /api/categories        # Get all categories
GET    /api/categories/:id    # Get single category
POST   /api/categories        # Create category (Admin only)
PUT    /api/categories/:id    # Update category (Admin only)
DELETE /api/categories/:id    # Delete category (Admin only)
```

### Contact Endpoints
```http
POST   /api/contacts/submit   # Submit contact form
GET    /api/contacts          # Get all contacts (Admin only)
GET    /api/contacts/:id      # Get single contact (Admin only)
PATCH  /api/contacts/:id/status  # Update contact status (Admin)
DELETE /api/contacts/:id      # Delete contact (Admin only)
```

## 🔒 Authentication & Authorization

### JWT Token Structure
```javascript
{
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-based Access
- **Customer**: Can access own cart, orders, wishlist, profile
- **Admin**: Full access to all resources and management features

### Protected Route Example
```javascript
// Middleware usage
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route
router.post('/admin-only', authenticateToken, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  role: String (enum: ['customer', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  richDescription: String,
  image: String,
  images: [String],
  brand: String,
  price: Number,
  currency: String (default: 'ETB'),
  category: ObjectId (ref: Category),
  stock: Number,
  lowStockThreshold: Number,
  rating: Number,
  reviewCount: Number,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User),
  orderItems: [OrderItem],
  totalAmount: Number,
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  paymentMethod: String,
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Security Features

### Input Validation
- **Request Sanitization** - Clean user inputs
- **Schema Validation** - Mongoose schema validation
- **Type Checking** - Ensure correct data types

### Security Headers
```javascript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
```

### Rate Limiting
```javascript
// API rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## ⚙️ Environment Variables (Reference)

| Variable | Purpose | Required | Notes |
|----------|---------|----------|-------|
| `PORT` | HTTP server port | No | Defaults to 5000 |
| `NODE_ENV` | Environment mode | No | `development` / `production` |
| `MONGODB_URI` | Primary (Atlas) Mongo connection | Yes (prod) | First attempt |
| `MONGODB_URI_LOCAL` | Local fallback Mongo | Recommended | Used if primary fails |
| `JWT_SECRET` | Signing secret for auth tokens | Yes | Keep long & random |
| `CLIENT_URL` | Production frontend origin | Yes (prod) | Prioritized in CORS |
| `CLIENT_URL_LOCAL` | Local dev frontend origin | Recommended | Added after production in CORS list |
| `CLIENT_URLS` | Extra comma-separated origins | Optional | Appended (legacy) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes (if images) |  |
| `CLOUDINARY_API_KEY` | Cloudinary key | Yes |  |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | Yes | Never commit |
| `EMAIL_HOST` / `EMAIL_PORT` | SMTP server | Optional | Needed if email features active |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP auth | Optional | Use app password / secret |

### Sample `.env` (Production-Oriented)
```env
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/beauty
MONGODB_URI_LOCAL=mongodb://localhost:27017/beauty-ecommerce

# Auth
JWT_SECRET=super-long-random-secret-value

# Frontend Origins (priority order: prod then local)
CLIENT_URL=https://adeybloom-ecommerce-client.netlify.app
CLIENT_URL_LOCAL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=example@gmail.com
EMAIL_PASS=app-specific-password
```

### Operational Logs
On startup you will see logs like:
```
[CORS] Allowed origins (priority order): [ 'https://adeybloom-ecommerce-client.netlify.app', 'http://localhost:5173' ]
MongoDB Connected (primary Atlas): cluster.mongodb.net
```
If Atlas fails you will see a fallback attempt:
```
[DB] Primary connection failed – attempting local fallback...
MongoDB Connected (fallback local): mongodb://localhost:27017/beauty-ecommerce
```

## 🩺 Suggested (Optional) Enhancements
- Add `/api/health` returning `{ status: 'ok', db: 'connected', uptime: <seconds> }` for uptime checks.
- Implement structured logging (pino / winston) with log levels.
- Add indexing & query performance monitoring for large catalogs.
- Introduce pagination metadata standardization across all list endpoints.

---
Latest README adjustments reflect: database failover, prioritized CORS, dynamic review endpoints, and enriched product responses.

## 📧 Email Integration

### Nodemailer Configuration
```javascript
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### Email Templates
- **Welcome Email** - New user registration
- **Order Confirmation** - Order placement confirmation
- **Order Status Updates** - Status change notifications
- **Password Reset** - Password recovery emails

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- **Unit Tests** - Controller and model testing
- **Integration Tests** - API endpoint testing
- **Authentication Tests** - JWT and role-based access testing

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secure-production-secret
CLOUDINARY_CLOUD_NAME=your-production-cloud-name
CLOUDINARY_API_KEY=your-production-api-key
CLOUDINARY_API_SECRET=your-production-api-secret
```

### Deployment Platforms
- **Heroku** - Easy deployment with MongoDB Atlas
- **AWS EC2** - Full control over server configuration
- **DigitalOcean** - Cost-effective cloud deployment
- **Railway** - Modern deployment platform

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow RESTful API conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Samuel Aemro** - *Lead Backend Developer* - [@samuelAemro12](https://github.com/samuelAemro12)
- **Feven Mesfin** - *Developer* - [@Phebe-Mesfin](https://github.com/Phebe-Mesfin)

## 🙏 Acknowledgments

- MongoDB community for excellent documentation
- Express.js team for the robust framework
- Ethiopian developers community for inspiration
- Open source contributors for amazing packages

---

**AdeyBloom Backend** - Powering Ethiopian beauty e-commerce 🌸
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

