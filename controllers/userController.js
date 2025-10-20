const pool = require("../config/db");

// @desc    Get all users
// @route   GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new user
// @route   POST /api/users
const addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      res.status(400);
      throw new Error("User already exists");
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getUserDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      data: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const { name, phone, address, city } = req.body;

    // Update the user in the database
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, phone = $2, address = $3, city = $4
       WHERE id = $5
       RETURNING id, name, email, phone, address, city, role`,
      [name, phone, address, city, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUsers, addUser, getUserDetails,updateUserDetails };
