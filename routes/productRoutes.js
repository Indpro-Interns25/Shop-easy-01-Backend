const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts
} = require('../controllers/productController');

// GET /api/products - Get all products
router.get('/', getAllProducts);

// GET /api/products/search?q=searchTerm - Search products
router.get('/search', searchProducts);

// GET /api/products/category/:categoryId - Get products by category
router.get('/category/:categoryId', getProductsByCategory);

// GET /api/products/:id - Get product by ID
router.get('/:id', getProductById);

module.exports = router;
