const Cart = require('../models/cart');

// Get cart items for user
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const cartItems = await Cart.getCartItems(userId);
    
    res.json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items',
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const result = await Cart.addItem(userId, productId, quantity);
    
    res.json({
      success: true,
      message: 'Item added to cart',
      data: result
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const result = await Cart.updateItemQuantity(userId, productId, quantity);
    
    res.json({
      success: true,
      message: 'Cart item updated',
      data: result
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await Cart.removeItem(userId, productId);
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: result
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Cart.clearCart(userId);
    
    res.json({
      success: true,
      message: 'Cart cleared',
      data: result
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Get cart count
const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Cart.getCartCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting cart count',
      error: error.message
    });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
};