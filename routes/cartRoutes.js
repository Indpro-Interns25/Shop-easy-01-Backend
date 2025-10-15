const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(authenticate);

// GET /api/cart - Get cart items
router.get('/', getCartItems);

// GET /api/cart/count - Get cart count
router.get('/count', getCartCount);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// PUT /api/cart/:productId - Update cart item quantity
router.put('/:productId', updateCartItem);

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', removeFromCart);

// DELETE /api/cart - Clear cart
router.delete('/', clearCart);

module.exports = router;