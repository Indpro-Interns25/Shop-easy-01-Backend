const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.substring(7); // remove 'Bearer '
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user details from database using ID from token
    const result = await pool.query(
      "SELECT id, name, email, phone, address, profile_image, role, city FROM users WHERE id = $1",
      [decoded.id] // assuming token stores user ID
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = result.rows[0]; // full user data
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { authenticate };
