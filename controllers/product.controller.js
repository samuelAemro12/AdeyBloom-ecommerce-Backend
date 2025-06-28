import Product from '../models/product.model.js';
import Review from '../models/review.model.js';
import Promotion from '../models/promotion.model.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

// Helper function to calculate product rating and review count
const calculateProductStats = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      return { rating: 0, reviewCount: 0 };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;
    
    return {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: totalReviews
    };
  } catch (error) {
    console.error('Error calculating product stats:', error);
    return { rating: 0, reviewCount: 0 };
  }
};

// Helper function to calculate discount from promotions
const calculateDiscount = async (productId) => {
  try {
    const currentDate = new Date();
    const activePromotion = await Promotion.findOne({
      products: productId,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });
    
    return activePromotion ? activePromotion.discountPercent : 0;
  } catch (error) {
    console.error('Error calculating discount:', error);
    return 0;
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products with filtering and pagination
export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      category, 
      minPrice, 
      maxPrice, 
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { active: true };

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Calculate stats for each product
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stats = await calculateProductStats(product._id);
        const discount = await calculateDiscount(product._id);
        
        // Calculate discounted price if there's a discount
        let finalPrice = product.price;
        let originalPrice = product.originalPrice || product.price;
        
        if (discount > 0) {
          finalPrice = product.price * (1 - discount / 100);
        }
        
        return {
          ...product.toObject(),
          rating: stats.rating,
          reviewCount: stats.reviewCount,
          discount: discount,
          originalPrice: originalPrice,
          price: finalPrice
        };
      })
    );

    const count = await Product.countDocuments(query);

    res.json({
      products: productsWithStats,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Calculate stats for the product
    const stats = await calculateProductStats(product._id);
    const discount = await calculateDiscount(product._id);
    
    // Calculate discounted price if there's a discount
    let finalPrice = product.price;
    let originalPrice = product.originalPrice || product.price;
    
    if (discount > 0) {
      finalPrice = product.price * (1 - discount / 100);
    }
    
    const productWithStats = {
      ...product.toObject(),
      rating: stats.rating,
      reviewCount: stats.reviewCount,
      discount: discount,
      originalPrice: originalPrice,
      price: finalPrice
    };
    
    res.json(productWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $lte: '$lowStockThreshold' },
      active: true
    }).populate('category', 'name');
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product stock
export const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        stock,
        lastRestockDate: Date.now()
      },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// General image upload controller
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products',
    });
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed', details: error.message });
  }
}; 