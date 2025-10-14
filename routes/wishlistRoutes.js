const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
  getWishlistCount
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.use(authenticate);

// GET /api/wishlist - Get wishlist items
router.get('/', getWishlistItems);

// GET /api/wishlist/count - Get wishlist count
router.get('/count', getWishlistCount);

// POST /api/wishlist - Add item to wishlist
router.post('/', addToWishlist);

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete('/:productId', removeFromWishlist);

module.exports = router;