// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// MongoDB Atlas connection with proper configuration
const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!MONGO_URL) {
  console.error('MONGO_URL environment variable is not set');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  console.log('Please set MONGO_URL in your Railway environment variables');
  // Prevent infinite restarts
  setTimeout(() => process.exit(1), 5000);
  return;
}

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
 
app.use(express.json());

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'De Canokart API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API is healthy', 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
 
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  description: String,
  price: { type: Number, required: true },
  brand: String,
  image: String,
  images: [String],
  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  dateOfBirth: Date,
  gender: String,
  businessName: String,
  gstNumber: String,
  panNumber: String,
  addresses: [{
    type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
  }],
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }]
}, { timestamps: true });

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: String,
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  guestInfo: {
    name: String,
    email: String,
    address: String
  }
}, { timestamps: true });

const recentlyViewedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const stockNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  email: String,
  notified: { type: Boolean, default: false }
}, { timestamps: true });

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  expiryDate: Date
}, { timestamps: true });

const returnRequestSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'processed'], default: 'pending' },
  refundAmount: Number,
  adminNotes: String
}, { timestamps: true });

const supportTicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  adminResponse: String
}, { timestamps: true });

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const searchLogSchema = new mongoose.Schema({
  query: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  resultsCount: { type: Number, default: 0 }
}, { timestamps: true });
 
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Review = mongoose.model('Review', reviewSchema);
const Order = mongoose.model('Order', orderSchema);
const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);
const StockNotification = mongoose.model('StockNotification', stockNotificationSchema);
const Coupon = mongoose.model('Coupon', couponSchema);
const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);
const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
const FAQ = mongoose.model('FAQ', faqSchema);
const SearchLog = mongoose.model('SearchLog', searchLogSchema);
 
// Function to seed initial data into the database
const seedDatabase = async () => {
  try {
    await Product.deleteMany(); // Clear existing data
 
    const products = [
      {
        name: "Men's Casual T-shirt",
        category: 'Clothing',
        subcategory: 'T-shirts',
        brand: 'Fashion Co',
        description: 'Comfortable and stylish casual T-shirt for men',
        price: 350,
        stock: 50,
        inStock: true,
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407153931/gfg-tshirts.jpg',
        images: [
          'https://media.geeksforgeeks.org/wp-content/uploads/20230407153931/gfg-tshirts.jpg',
          'https://media.geeksforgeeks.org/wp-content/uploads/20230407153931/gfg-tshirts.jpg'
        ]
      },
      {
        name: 'Luxury bag',
        category: 'Accessories',
        subcategory: 'Bags',
        brand: 'Luxury Brand',
        description: 'Elegant luxury bag with leather strap',
        price: 2500,
        stock: 10,
        inStock: true,
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg',
        images: [
          'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg',
          'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg'
        ]
      },
      {
        name: "Hoodie",
        category: 'Clothing',
        subcategory: 'Hoodies',
        brand: 'Comfort Wear',
        description: 'Light and classy hoodies for every seasons',
        price: 450,
        stock: 30,
        inStock: true,
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407153938/gfg-hoodie.jpg'
      },
      {
        name: 'Remote Control Toy car',
        category: 'Toys',
        subcategory: 'RC Cars',
        brand: 'ToyTech',
        description: 'High-quality Toy car for fun and adventure',
        price: 1200,
        stock: 15,
        inStock: true,
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20240122182422/images1.jpg'
      },
      {
        name: 'Books',
        category: 'Books',
        subcategory: 'Fiction',
        brand: 'BookWorld',
        description: 'You will have a great time reading',
        price: 500,
        stock: 100,
        inStock: true,
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20240110011854/reading-925589_640.jpg'
      },
      {
        name: 'Travel Bag',
        category: 'Accessories',
        subcategory: 'Bags',
        brand: 'Travel Pro',
        description: 'Comfortable and supportive travel bag',
        price: 800,
        stock: 25,
        inStock: true,
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg'
      },
      {
        name: 'Winter hoodies for women',
        category: 'Clothing',
        subcategory: 'Hoodies',
        brand: 'WomenWear',
        description: 'Stay cozy in style with our womens hoodie, crafted for comfort',
        price: 250,
        stock: 0,
        inStock: false,
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407153938/gfg-hoodie.jpg'
      },
      {
        name: 'Honda car model',
        category: 'Toys',
        subcategory: 'Model Cars',
        brand: 'ModelCraft',
        description: 'Detailed Honda car model for collectors',
        price: 700,
        stock: 5,
        inStock: true,
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20240122184958/images2.jpg'
      }
    ];
    
  
    
      
 
    await Product.insertMany(products);
    
    // Add more sample products for better display
    const additionalProducts = [
      {
        name: 'Smartphone Pro Max',
        category: 'Electronics',
        subcategory: 'Smartphones',
        brand: 'TechBrand',
        description: 'Latest smartphone with advanced features',
        price: 45999,
        stock: 20,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
      },
      {
        name: 'Wireless Earbuds',
        category: 'Electronics',
        subcategory: 'Audio',
        brand: 'SoundTech',
        description: 'Premium wireless earbuds with noise cancellation',
        price: 8999,
        stock: 35,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop'
      },
      {
        name: 'Designer Sneakers',
        category: 'Fashion',
        subcategory: 'Shoes',
        brand: 'StyleCo',
        description: 'Trendy sneakers for everyday wear',
        price: 5999,
        stock: 15,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop'
      },
      {
        name: 'Smart Watch',
        category: 'Electronics',
        subcategory: 'Wearables',
        brand: 'WearTech',
        description: 'Advanced smartwatch with health tracking',
        price: 12999,
        stock: 25,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
      }
    ];
    
    await Product.insertMany(additionalProducts);
    
    // Seed FAQs
    await FAQ.deleteMany();
    const faqs = [
      {
        question: 'How do I track my order?',
        answer: 'You can track your order by logging into your account and viewing your order history.',
        category: 'Orders',
        order: 1
      },
      {
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of purchase. Items must be in original condition.',
        category: 'Returns',
        order: 1
      },
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.',
        category: 'Shipping',
        order: 1
      },
      {
        question: 'Do you offer international shipping?',
        answer: 'Currently, we only ship within the United States.',
        category: 'Shipping',
        order: 2
      }
    ];
    
    await FAQ.insertMany(faqs);
    
    // Seed test coupon
    await Coupon.deleteMany();
    const testCoupon = new Coupon({
      code: 'SAVE10',
      type: 'percentage',
      value: 10,
      minOrder: 50,
      maxUses: 100,
      active: true
    });
    await testCoupon.save();
    
    console.log('Database seeded successfully');
    console.log('Test coupon created: SAVE10 (10% off orders over $50)');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
 
// Seed the database on server startup
seedDatabase(); // Auto-seed for development
 
// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Seller middleware
const sellerAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ error: 'Seller access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name, email, isAdmin: user.isAdmin, isSeller: user.isSeller } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Seller registration
app.post('/api/seller/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, isSeller: true });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name, email, isAdmin: user.isAdmin, isSeller: user.isSeller } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email, isAdmin: user.isAdmin, isSeller: user.isSeller } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, businessName, gstNumber, panNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, phone, dateOfBirth, gender, businessName, gstNumber, panNumber },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user stats
app.get('/api/user/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get orders count
    const ordersCount = await Order.countDocuments({ userId });
    
    // Get wishlist count
    const wishlist = await Wishlist.findOne({ userId });
    const wishlistCount = wishlist ? wishlist.productIds.length : 0;
    
    // Get cart count
    const cart = await Cart.findOne({ userId });
    const cartCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    
    // Get seller stats if user is seller
    let sellerStats = {};
    const user = await User.findById(userId);
    if (user.isSeller) {
      const sellerProducts = await Product.countDocuments({ sellerId: userId });
      const sellerOrders = await Order.aggregate([
        { $unwind: '$items' },
        { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'product' } },
        { $match: { 'product.sellerId': new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
      ]);
      
      sellerStats = {
        products: sellerProducts,
        sales: sellerOrders[0]?.count || 0,
        revenue: sellerOrders[0]?.revenue || 0
      };
    }
    
    res.json({
      orders: ordersCount,
      wishlist: wishlistCount,
      cart: cartCount,
      ...sellerStats
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user addresses
app.get('/api/user/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('addresses');
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add user address
app.post('/api/user/addresses', auth, async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({ type, street, city, state, zipCode, country, isDefault });
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user address
app.put('/api/user/addresses/:addressId', auth, async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.user.userId);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    Object.assign(address, { type, street, city, state, zipCode, country, isDefault });
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user address
app.delete('/api/user/addresses/:addressId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.addresses.id(req.params.addressId).remove();
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Password reset request
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // In production, send email with resetToken
    res.json({ message: 'Reset token generated', resetToken }); // Remove resetToken in production
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Confirm password reset
app.post('/api/reset-password/confirm', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products with filtering and search
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, subcategory, brand, minPrice, maxPrice, inStock } = req.query;
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (inStock === 'true') filter.inStock = true;
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Add to recently viewed if user is logged in
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        let recentlyViewed = await RecentlyViewed.findOne({ userId: decoded.userId });
        if (!recentlyViewed) {
          recentlyViewed = new RecentlyViewed({ userId: decoded.userId, productIds: [] });
        }
        recentlyViewed.productIds = recentlyViewed.productIds.filter(id => id.toString() !== req.params.id);
        recentlyViewed.productIds.unshift(req.params.id);
        recentlyViewed.productIds = recentlyViewed.productIds.slice(0, 10);
        await recentlyViewed.save();
      } catch (err) {}
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product recommendations
app.get('/api/products/:id/recommendations', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Find products bought together
    const orders = await Order.find({
      'items.productId': req.params.id
    }).populate('items.productId');
    
    const productCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId._id.toString() !== req.params.id) {
          const id = item.productId._id.toString();
          productCounts[id] = (productCounts[id] || 0) + 1;
        }
      });
    });
    
    const sortedProducts = Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([id]) => id);
    
    const recommendations = await Product.find({ _id: { $in: sortedProducts } });
    
    // If not enough recommendations, add similar category products
    if (recommendations.length < 4) {
      const similarProducts = await Product.find({
        category: product.category,
        _id: { $ne: req.params.id, $nin: sortedProducts }
      }).limit(4 - recommendations.length);
      recommendations.push(...similarProducts);
    }
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get subcategories by category
app.get('/api/subcategories/:category', async (req, res) => {
  try {
    const subcategories = await Product.distinct('subcategory', { category: req.params.category });
    res.json(subcategories.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get brands
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cart endpoints
app.get('/api/cart', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/cart', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.userId });
    
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/cart/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Wishlist endpoints
app.get('/api/wishlist', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.userId }).populate('productIds');
    res.json(wishlist || { productIds: [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/wishlist', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.userId, productIds: [] });
    }
    
    if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
      await wishlist.save();
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/wishlist/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (wishlist) {
      wishlist.productIds = wishlist.productIds.filter(id => id.toString() !== req.params.productId);
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Review endpoints
app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/reviews', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = new Review({ productId, userId: req.user.userId, rating, comment });
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mock payment processing
app.post('/api/process-payment', async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    // Mock payment processing - always succeeds for demo
    const paymentResult = {
      success: true,
      transactionId: 'txn_' + Date.now(),
      amount,
      method: paymentMethod,
      status: 'completed'
    };
    
    res.json(paymentResult);
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Checkout endpoints
app.post('/api/checkout', auth, async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    const subtotal = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    const total = subtotal; // Simplified for demo
    
    const order = new Order({
      userId: req.user.userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      })),
      subtotal,
      total,
      status: 'confirmed'
    });
    
    await order.save();
    await Cart.findOneAndDelete({ userId: req.user.userId });
    
    // Send order confirmation email (mock)
    const user = await User.findById(req.user.userId);
    console.log(`Order confirmation sent to ${user.email} for order ${order._id}`);
    
    res.json({ orderId: order._id, total, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Guest checkout endpoint
app.post('/api/guest-checkout', async (req, res) => {
  try {
    const { items, guestInfo, paymentMethod } = req.body;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // Simplified for demo
    
    const order = new Order({
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      total,
      guestInfo,
      status: 'confirmed'
    });
    
    await order.save();
    
    // Send guest order confirmation email (mock)
    console.log(`Guest order confirmation sent to ${guestInfo.email} for order ${order._id}`);
    
    res.json({ orderId: order._id, total, message: 'Guest order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user order history
app.get('/api/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.productId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Seller Product Management
app.post('/api/seller/products', auth, sellerAuth, async (req, res) => {
  try {
    const product = new Product({ ...req.body, sellerId: req.user.userId });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/seller/products', auth, sellerAuth, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/seller/products/:id', auth, sellerAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/seller/products/:id', auth, sellerAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user.userId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Product Management
app.post('/api/admin/products', auth, adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Order Management
app.get('/api/admin/orders', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').populate('items.productId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/orders/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('userId', 'name email');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Send email notification (mock)
    const email = order.userId?.email || order.guestInfo?.email;
    if (email) {
      console.log(`Order ${order._id} status updated to ${status} - Email sent to ${email}`);
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin User Management
app.get('/api/admin/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isAdmin }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Recently viewed products
app.get('/api/recently-viewed', auth, async (req, res) => {
  try {
    const recentlyViewed = await RecentlyViewed.findOne({ userId: req.user.userId })
      .populate('productIds');
    res.json(recentlyViewed?.productIds || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Stock notifications
app.post('/api/stock-notifications', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.userId);
    
    const existing = await StockNotification.findOne({
      userId: req.user.userId,
      productId
    });
    
    if (!existing) {
      const notification = new StockNotification({
        userId: req.user.userId,
        productId,
        email: user.email
      });
      await notification.save();
    }
    
    res.json({ message: 'Stock notification set' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate coupon
app.post('/api/validate-coupon', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      active: true,
      $or: [{ expiryDate: { $gt: new Date() } }, { expiryDate: null }]
    });
    
    if (!coupon) return res.status(400).json({ error: 'Invalid coupon code' });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }
    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({ error: `Minimum order amount is $${coupon.minOrder}` });
    }
    
    const discount = coupon.type === 'percentage' 
      ? (orderTotal * coupon.value / 100)
      : coupon.value;
    
    res.json({ discount, coupon });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Calculate shipping
app.post('/api/calculate-shipping', async (req, res) => {
  try {
    const { weight, distance, method } = req.body;
    let shipping = 0;
    
    // Basic shipping calculation
    if (method === 'standard') {
      shipping = Math.max(5, weight * 0.5 + distance * 0.1);
    } else if (method === 'express') {
      shipping = Math.max(15, weight * 1 + distance * 0.2);
    }
    
    res.json({ shipping: Math.round(shipping * 100) / 100 });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Calculate tax
app.post('/api/calculate-tax', async (req, res) => {
  try {
    const { subtotal, state } = req.body;
    const taxRates = {
      'CA': 0.0875, 'NY': 0.08, 'TX': 0.0625, 'FL': 0.06
    };
    
    const taxRate = taxRates[state] || 0.05; // Default 5%
    const tax = subtotal * taxRate;
    
    res.json({ tax: Math.round(tax * 100) / 100, taxRate });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Return request
app.post('/api/return-request', auth, async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    const returnRequest = new ReturnRequest({
      orderId,
      userId: req.user.userId,
      reason
    });
    
    await returnRequest.save();
    res.json({ message: 'Return request submitted', requestId: returnRequest._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user return requests
app.get('/api/return-requests', auth, async (req, res) => {
  try {
    const requests = await ReturnRequest.find({ userId: req.user.userId })
      .populate('orderId', 'total createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin coupon management
app.post('/api/admin/coupons', auth, adminAuth, async (req, res) => {
  try {
    const coupon = new Coupon({ ...req.body, code: req.body.code.toUpperCase() });
    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/coupons', auth, adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin return requests
app.get('/api/admin/return-requests', auth, adminAuth, async (req, res) => {
  try {
    const requests = await ReturnRequest.find()
      .populate('userId', 'name email')
      .populate('orderId', 'total createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/return-requests/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status, refundAmount, adminNotes } = req.body;
    const request = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status, refundAmount, adminNotes },
      { new: true }
    );
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Support ticket submission
app.post('/api/support', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const ticket = new SupportTicket({ name, email, subject, message });
    await ticket.save();
    
    // Send email notification (mock)
    console.log(`Support ticket created: ${ticket._id} for ${email}`);
    
    res.json({ message: 'Support ticket submitted successfully', ticketId: ticket._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find({ active: true }).sort({ category: 1, order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin support ticket management
app.get('/api/admin/support-tickets', auth, adminAuth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/support-tickets/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    );
    
    // Send email notification (mock)
    if (adminResponse) {
      console.log(`Response sent to ${ticket.email}: ${adminResponse}`);
    }
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin FAQ management
app.post('/api/admin/faqs', auth, adminAuth, async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/faqs', auth, adminAuth, async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ category: 1, order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/faqs/:id', auth, adminAuth, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/faqs/:id', auth, adminAuth, async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Featured products endpoint
app.get('/api/featured-products', async (req, res) => {
  try {
    const featuredProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          avgRating: { $ifNull: [{ $avg: '$reviews.rating' }, 4] },
          reviewCount: { $size: '$reviews' }
        }
      },
      { $sort: { avgRating: -1, createdAt: -1 } },
      { $limit: 6 }
    ]);

    res.json(featuredProducts);
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Our collection endpoint with scoring algorithm
app.get('/api/our-collection', async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          avgRating: { $ifNull: [{ $avg: '$reviews.rating' }, 4] },
          reviewCount: { $size: '$reviews' }
        }
      },
      { $sort: { avgRating: -1, price: 1, createdAt: -1 } },
      { $limit: 20 }
    ]);

    res.json(products);
  } catch (error) {
    console.error('Our collection error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { 
      q: query, 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      rating,
      inStock,
      sortBy = 'relevance',
      limit = 20,
      page = 1
    } = req.query;

    // Validate query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search query is required',
        products: []
      });
    }

    let filter = {};
    
    // Search in multiple fields (case-insensitive)
    const searchTerm = query.toLowerCase().trim();
    filter.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } }
    ];

    // Apply filters
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true') {
      filter.inStock = true;
      filter.stock = { $gt: 0 };
    }

    // Execute search
    let products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        products = products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products = products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products = products.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case 'rating':
        // For now, sort by name as we don't have ratings in schema
        products = products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);

    // Log search query
    const token = req.header('Authorization')?.replace('Bearer ', '');
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {}
    }

    await SearchLog.create({
      query: query.trim(),
      userId,
      sessionId: req.ip,
      resultsCount: products.length
    });

    res.json({
      products,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      query: query.trim()
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed', 
      message: error.message,
      products: []
    });
  }
});

// Search suggestions endpoint
app.get('/api/search/suggestions', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchTerm = query.toLowerCase();
    
    // Get unique suggestions from products
    const suggestions = await Product.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } },
            { brand: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          names: { $addToSet: '$name' },
          categories: { $addToSet: '$category' },
          brands: { $addToSet: '$brand' }
        }
      }
    ]);

    // Combine and limit suggestions
    const allSuggestions = [];
    if (suggestions.length > 0) {
      allSuggestions.push(
        ...(suggestions[0].names || []),
        ...(suggestions[0].categories || []),
        ...(suggestions[0].brands || [])
      );
    }
    
    const filteredSuggestions = allSuggestions
      .filter(s => s && s.toLowerCase().includes(searchTerm))
      .slice(0, 8);

    res.json({ suggestions: filteredSuggestions });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ suggestions: [] });
  }
});

// Admin Analytics
app.get('/api/admin/analytics', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5)
      .populate('userId', 'name').populate('items.productId', 'name');
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
 
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});