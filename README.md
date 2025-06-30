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
