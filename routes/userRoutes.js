const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  changePassword
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.use(protect);
router.get('/me', getCurrentUser);
router.put('/update', updateUser);
router.put('/change-password', changePassword);

module.exports = router;