# Beauty Product E-commerce Backend

A comprehensive RESTful API backend for a beauty product e-commerce platform built with Node.js, Express.js, and MongoDB. This backend provides complete functionality for managing products, users, orders, shopping cart, wishlist, and more.

## 🌟 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Product Management** - CRUD operations with advanced filtering, search, and pagination
- **Shopping Cart** - Add, update, remove items with persistent storage
- **Wishlist** - Save favorite products with notification preferences
- **Order Management** - Complete order processing with status tracking
- **Category Management** - Organize products by categories
- **Review System** - Product ratings and reviews
- **Contact System** - Customer inquiry management

### Advanced Features
- **Image Upload** - Cloudinary integration for product images
- **Inventory Management** - Stock tracking with low stock alerts
- **Promotion System** - Discount management and pricing
- **Email Notifications** - Nodemailer integration
- **Security** - Helmet, CORS, rate limiting, and input validation
- **Search & Filtering** - Advanced product search with multiple filters

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Security:** Helmet, bcryptjs, express-rate-limit
- **Development:** Nodemon for hot reloading

## 📁 Project Structure

```
beauty-product-ecommerce-Backend/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── auth.controller.js     # Authentication logic
│   ├── cart.controller.js     # Shopping cart operations
│   ├── category.controller.js # Category management
│   ├── contact.controller.js  # Contact form handling
│   ├── order.controller.js    # Order processing
│   ├── product.controller.js  # Product CRUD operations
│   └── wishlist.controller.js # Wishlist management
├── middleware/
│   └── auth.middleware.js     # Authentication middleware
├── models/
│   ├── cart.model.js          # Cart schema
│   ├── category.model.js      # Category schema
│   ├── contact.model.js       # Contact schema
│   ├── order.model.js         # Order schema
│   ├── orderItem.model.js     # Order item schema
│   ├── product.model.js       # Product schema
│   ├── promotion.model.js     # Promotion schema
│   ├── refund.model.js        # Refund schema
│   ├── review.model.js        # Review schema
│   ├── user.model.js          # User schema
│   └── wishlist.model.js      # Wishlist schema
├── routes/
│   ├── auth.routes.js         # Authentication routes
│   ├── cart.routes.js         # Cart routes
│   ├── category.routes.js     # Category routes
│   ├── contact.routes.js      # Contact routes
│   ├── order.routes.js        # Order routes
│   ├── product.routes.js      # Product routes
│   ├── profile.routes.js      # User profile routes
│   ├── review.routes.js       # Review routes
│   └── wishlist.routes.js     # Wishlist routes
├── index.js                   # Application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/samuelAemro12/beauty-product-ecommerce-Backend.git
cd beauty-product-ecommerce-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/beauty-ecommerce
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beauty-ecommerce

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URLs (comma-separated for multiple origins)
CLIENT_URLS=http://localhost:5173,http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or your specified PORT).

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication with the following roles:
- **Customer**: Can browse products, manage cart/wishlist, place orders
- **Admin**: Full access to all resources including product/category management

### Authentication Flow
1. Register/Login to receive JWT token
2. Token is stored in HTTP-only cookie
3. Include token in subsequent requests
4. Middleware validates token and user permissions

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register          # Register new user
POST   /login             # User login
POST   /logout            # User logout
GET    /profile           # Get user profile (protected)
PUT    /profile           # Update user profile (protected)
```

### Product Routes (`/api/products`)
```
GET    /                  # Get all products (with filtering & pagination)
GET    /:id               # Get single product
POST   /                  # Create product (admin only)
PUT    /:id               # Update product (admin only)
DELETE /:id               # Delete product (admin only)
```

**Query Parameters for GET /products:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `category` - Filter by category ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search in product name/description
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)

### Cart Routes (`/api/cart`) - Protected
```
GET    /                  # Get user's cart
POST   /add               # Add item to cart
PATCH  /update/:productId # Update item quantity
DELETE /remove/:productId # Remove item from cart
DELETE /clear             # Clear entire cart
```

### Wishlist Routes (`/api/wishlist`) - Protected
```
GET    /                  # Get user's wishlist
POST   /add               # Add item to wishlist
DELETE /remove/:productId # Remove item from wishlist
```

### Order Routes (`/api/orders`) - Protected
```
GET    /                  # Get user's orders
GET    /:id               # Get specific order
POST   /                  # Create new order
PUT    /:id/status        # Update order status (admin only)
```

### Category Routes (`/api/categories`)
```
GET    /                  # Get all categories (public)
GET    /:id               # Get single category (public)
POST   /                  # Create category (admin only)
PUT    /:id               # Update category (admin only)
DELETE /:id               # Delete category (admin only)
```

### Contact Routes (`/api/contacts`)
```
POST   /                  # Submit contact form (public)
GET    /                  # Get all contacts (admin only)
PUT    /:id/status        # Update contact status (admin only)
```

## 🗄️ Database Models

### User Model
- `name` - User's full name
- `email` - Unique email address
- `passwordHash` - Encrypted password
- `role` - 'customer' or 'admin'

### Product Model
- `name` - Product name
- `brand` - Product brand
- `description` - Product description
- `ingredients` - Product ingredients
- `price` - Current price
- `originalPrice` - Original price (for discounts)
- `discount` - Discount percentage
- `stock` - Available quantity
- `category` - Reference to Category
- `images` - Array of image URLs
- `rating` - Average rating (0-5)
- `reviewCount` - Number of reviews

### Order Model
- `user` - Reference to User
- `orderItems` - Array of OrderItem references
- `totalAmount` - Total order amount
- `shippingAddress` - Delivery address
- `status` - 'pending', 'shipped', 'delivered', 'cancelled'
- `trackingNumber` - Shipping tracking number

### Cart Model
- `user` - Reference to User
- `products` - Array of {product, quantity}

### Wishlist Model
- `user` - Reference to User
- `products` - Array of {product, addedAt, notifyOnSale, notifyOnStock}

## 💡 Usage Examples

### Register a New User
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Get Products with Filters
```javascript
GET /api/products?category=64f1a2b3c4d5e6f7g8h9i0j1&minPrice=100&maxPrice=500&search=moisturizer&page=1&limit=20
```

### Add Item to Cart
```javascript
POST /api/cart/add
Content-Type: application/json
Authorization: Bearer <token>

{
  "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "quantity": 2
}
```

### Create an Order
```javascript
POST /api/orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Addis Ababa",
    "state": "Addis Ababa",
    "zipCode": "1000",
    "country": "Ethiopia"
  },
  "paymentMethod": "cash_on_delivery"
}
```

## 🔧 Development

### Running Tests
```bash
npm test
```

### Code Style
This project follows standard JavaScript conventions. Consider using ESLint and Prettier for consistent code formatting.

### API Testing
You can test the API endpoints using tools like:
- **Postman** - Import the API collection
- **Thunder Client** - VS Code extension
- **curl** - Command line tool

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set secure JWT secrets
5. Enable HTTPS in production

### Recommended Platforms
- **Heroku** - Easy deployment with MongoDB Atlas
- **Railway** - Modern deployment platform
- **DigitalOcean** - VPS deployment
- **AWS/Azure/GCP** - Cloud deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add appropriate error handling
- Include input validation
- Write clear commit messages
- Update documentation as needed

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Samuel Aemro Melese** - [@samuelAemro12](https://github.com/samuelAemro12)

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database
- All open-source contributors whose packages made this project possible

## 📞 Support

If you have any questions or need help with setup, please:
1. Check the existing [Issues](https://github.com/samuelAemro12/beauty-product-ecommerce-Backend/issues)
2. Create a new issue if your problem isn't already addressed
3. Provide detailed information about your environment and the issue

---

**Happy Coding! 🚀**
