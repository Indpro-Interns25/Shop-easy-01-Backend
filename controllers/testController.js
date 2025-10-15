const pool = require('../config/db');

// Test database connection and show table structure
const testDatabase = async (req, res) => {
  try {
    // Test basic connection
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Check if products table exists and get its structure
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position;
    `);

    // Get sample products
    const sampleProducts = await pool.query('SELECT * FROM products LIMIT 5');

    res.json({
      success: true,
      message: 'Database connection successful',
      connection_time: connectionTest.rows[0].now,
      table_structure: tableCheck.rows,
      sample_products: sampleProducts.rows,
      total_products: sampleProducts.rowCount
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};

module.exports = {
  testDatabase
};