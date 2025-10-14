const pool = require('../config/db');

class Product {
  // Get all products
  static async getAll() {
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          name, 
          description, 
          price, 
          image, 
          category_id, 
          stock, 
          seller_id,
          created_at,
          is_active
        FROM products 
        WHERE is_active = TRUE
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  // Get product by ID
  static async getById(id) {
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          name, 
          description, 
          price, 
          image, 
          category_id, 
          stock, 
          seller_id,
          created_at,
          is_active
        FROM products 
        WHERE id = $1 AND is_active = TRUE
      `, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  // Get products by category
  static async getByCategory(categoryId) {
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          name, 
          description, 
          price, 
          image, 
          category_id, 
          stock, 
          seller_id,
          created_at,
          is_active
        FROM products 
        WHERE category_id = $1 AND is_active = TRUE
        ORDER BY created_at DESC
      `, [categoryId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }
  }

  // Search products
  static async search(searchTerm) {
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          name, 
          description, 
          price, 
          image, 
          category_id, 
          stock, 
          seller_id,
          created_at,
          is_active
        FROM products 
        WHERE 
          (name ILIKE $1 OR description ILIKE $1) AND 
          is_active = TRUE
        ORDER BY created_at DESC
      `, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }
}

module.exports = Product;
