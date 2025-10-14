const pool = require('../config/db');

class Wishlist {
  // Get or create wishlist for user
  static async getOrCreateWishlist(userId) {
    try {
      // Check if user already has a wishlist
      let result = await pool.query(
        'SELECT id FROM wishlists WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        // Create new wishlist for user
        result = await pool.query(
          'INSERT INTO wishlists (user_id) VALUES ($1) RETURNING id',
          [userId]
        );
      }

      return result.rows[0].id;
    } catch (error) {
      throw new Error(`Error getting/creating wishlist: ${error.message}`);
    }
  }

  // Get wishlist items for user
  static async getWishlistItems(userId) {
    try {
      const result = await pool.query(`
        SELECT 
          wi.id,
          wi.added_at,
          p.id as product_id,
          p.name,
          p.description,
          p.price,
          p.image,
          p.stock
        FROM wishlist_items wi
        JOIN wishlists w ON wi.wishlist_id = w.id
        JOIN products p ON wi.product_id = p.id
        WHERE w.user_id = $1 AND p.is_active = TRUE
        ORDER BY wi.added_at DESC
      `, [userId]);

      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching wishlist items: ${error.message}`);
    }
  }

  // Add item to wishlist
  static async addItem(userId, productId) {
    try {
      // Get or create wishlist
      const wishlistId = await this.getOrCreateWishlist(userId);

      // Check if item already exists in wishlist
      const existingItem = await pool.query(
        'SELECT id FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2',
        [wishlistId, productId]
      );

      if (existingItem.rows.length > 0) {
        return { success: true, message: 'Item already in wishlist' };
      }

      // Add new item
      await pool.query(
        'INSERT INTO wishlist_items (wishlist_id, product_id) VALUES ($1, $2)',
        [wishlistId, productId]
      );

      return { success: true, message: 'Item added to wishlist' };
    } catch (error) {
      throw new Error(`Error adding item to wishlist: ${error.message}`);
    }
  }

  // Remove item from wishlist
  static async removeItem(userId, productId) {
    try {
      const result = await pool.query(`
        DELETE FROM wishlist_items 
        USING wishlists w
        WHERE wishlist_items.wishlist_id = w.id 
        AND w.user_id = $1 
        AND wishlist_items.product_id = $2
        RETURNING wishlist_items.id
      `, [userId, productId]);

      if (result.rows.length === 0) {
        throw new Error('Wishlist item not found');
      }

      return { success: true, message: 'Item removed from wishlist' };
    } catch (error) {
      throw new Error(`Error removing wishlist item: ${error.message}`);
    }
  }

  // Get wishlist count
  static async getWishlistCount(userId) {
    try {
      const result = await pool.query(`
        SELECT COUNT(*) as count
        FROM wishlist_items wi
        JOIN wishlists w ON wi.wishlist_id = w.id
        WHERE w.user_id = $1
      `, [userId]);

      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      throw new Error(`Error getting wishlist count: ${error.message}`);
    }
  }
}

module.exports = Wishlist;
