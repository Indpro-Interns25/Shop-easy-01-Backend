-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category_id INTEGER,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample dress data
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity) VALUES
('Elegant Evening Dress', 'A stunning black evening dress perfect for formal occasions', 129.99, 'https://images.unsplash.com/photo-1566479179817-1b5b8e5bc3c5?w=400&h=400&fit=crop', 1, 15),
('Summer Floral Sundress', 'Light and breezy floral sundress ideal for summer days', 89.99, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', 1, 25),
('Professional Blazer Dress', 'Smart casual blazer dress for office and business meetings', 109.99, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop', 1, 12),
('Bohemian Maxi Dress', 'Free-spirited maxi dress with intricate patterns and flowing fabric', 95.99, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop', 1, 18),
('Cocktail Party Dress', 'Sophisticated cocktail dress with sequin details', 149.99, 'https://images.unsplash.com/photo-1582142306909-195724d33c8d?w=400&h=400&fit=crop', 1, 8),
('Casual Denim Dress', 'Comfortable denim dress perfect for everyday wear', 79.99, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop', 1, 30),
('Vintage Tea Dress', 'Classic vintage-inspired tea dress with polka dot pattern', 119.99, 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=400&fit=crop', 1, 20),
('Wedding Guest Dress', 'Beautiful midi dress suitable for wedding celebrations', 134.99, 'https://images.unsplash.com/photo-1566479179817-1b5b8e5bc3c5?w=400&h=400&fit=crop', 1, 10);

-- Create categories table (optional, for future use)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Dresses', 'Beautiful dresses for all occasions'),
(2, 'Accessories', 'Fashion accessories and jewelry'),
(3, 'Shoes', 'Footwear collection'),
(4, 'Bags', 'Handbags and purses')
ON CONFLICT (id) DO NOTHING;