const pool = require('../config/db');

class Cart {
  // Get or create cart for user
  static async getOrCreateCart(userId) {
    try {
      // Check if user already has a cart
      let result = await pool.query(
        'SELECT id FROM carts WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        // Create new cart for user
        result = await pool.query(
          'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
          [userId]
        );
      }

      return result.rows[0].id;
    } catch (error) {
      throw new Error(`Error getting/creating cart: ${error.message}`);
    }
  }

  // Get cart items for user
  static async getCartItems(userId) {
    try {
      const result = await pool.query(`
        SELECT 
          ci.id,
          ci.quantity,
          ci.price_at_time,
          ci.added_at,
          p.id as product_id,
          p.name,
          p.description,
          p.price,
          p.image,
          p.stock
        FROM cart_items ci
        JOIN carts c ON ci.cart_id = c.id
        JOIN products p ON ci.product_id = p.id
        WHERE c.user_id = $1 AND p.is_active = TRUE
        ORDER BY ci.added_at DESC
      `, [userId]);

      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching cart items: ${error.message}`);
    }
  }

  // Add item to cart
  static async addItem(userId, productId, quantity = 1) {
    try {
      // Get or create cart
      const cartId = await this.getOrCreateCart(userId);

      // Get product price
      const productResult = await pool.query(
        'SELECT price FROM products WHERE id = $1 AND is_active = TRUE',
        [productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error('Product not found or inactive');
      }

      const price = productResult.rows[0].price;

      // Check if item already exists in cart
      const existingItem = await pool.query(
        'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
        [cartId, productId]
      );

      if (existingItem.rows.length > 0) {
        // Update quantity
        const newQuantity = existingItem.rows[0].quantity + quantity;
        await pool.query(
          'UPDATE cart_items SET quantity = $1 WHERE id = $2',
          [newQuantity, existingItem.rows[0].id]
        );
      } else {
        // Add new item
        await pool.query(
          'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
          [cartId, productId, quantity, price]
        );
      }

      // Update cart timestamp
      await pool.query(
        'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [cartId]
      );

      return { success: true };
    } catch (error) {
      throw new Error(`Error adding item to cart: ${error.message}`);
    }
  }

  // Update item quantity
  static async updateItemQuantity(userId, productId, quantity) {
    try {
      const result = await pool.query(`
        UPDATE cart_items 
        SET quantity = $3
        FROM carts c
        WHERE cart_items.cart_id = c.id 
        AND c.user_id = $1 
        AND cart_items.product_id = $2
        RETURNING cart_items.id
      `, [userId, productId, quantity]);

      if (result.rows.length === 0) {
        throw new Error('Cart item not found');
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Error updating cart item: ${error.message}`);
    }
  }

  // Remove item from cart
  static async removeItem(userId, productId) {
    try {
      const result = await pool.query(`
        DELETE FROM cart_items 
        USING carts c
        WHERE cart_items.cart_id = c.id 
        AND c.user_id = $1 
        AND cart_items.product_id = $2
        RETURNING cart_items.id
      `, [userId, productId]);

      if (result.rows.length === 0) {
        throw new Error('Cart item not found');
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Error removing cart item: ${error.message}`);
    }
  }

  // Clear cart
  static async clearCart(userId) {
    try {
      await pool.query(`
        DELETE FROM cart_items 
        USING carts c
        WHERE cart_items.cart_id = c.id 
        AND c.user_id = $1
      `, [userId]);

      return { success: true };
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }

  // Get cart count
  static async getCartCount(userId) {
    try {
      const result = await pool.query(`
        SELECT COALESCE(SUM(ci.quantity), 0) as count
        FROM cart_items ci
        JOIN carts c ON ci.cart_id = c.id
        WHERE c.user_id = $1
      `, [userId]);

      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      throw new Error(`Error getting cart count: ${error.message}`);
    }
  }
}

module.exports = Cart;
