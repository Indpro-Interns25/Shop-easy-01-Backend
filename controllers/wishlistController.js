const Wishlist = require('../models/wishlist');

// Get wishlist items for user
const getWishlistItems = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const wishlistItems = await Wishlist.getWishlistItems(userId);
    
    res.json({
      success: true,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Error getting wishlist items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist items',
      error: error.message
    });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const result = await Wishlist.addItem(userId, productId);
    
    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to wishlist',
      error: error.message
    });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await Wishlist.removeItem(userId, productId);
    
    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from wishlist',
      error: error.message
    });
  }
};

// Get wishlist count
const getWishlistCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Wishlist.getWishlistCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting wishlist count',
      error: error.message
    });
  }
};

module.exports = {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
  getWishlistCount
};