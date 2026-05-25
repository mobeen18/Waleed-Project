const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  register,
  login,
  getUsers,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, getUsers);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
