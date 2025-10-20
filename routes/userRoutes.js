const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  getUserDetails,
  updateUserDetails,
} = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware.js"); // Import the authenticate middleware

router.route("/").get(getUsers).post(addUser);
router.get("/details", authenticate, getUserDetails); 
router.put("/update", authenticate, updateUserDetails);
// Use the authenticate middleware

module.exports = router;
