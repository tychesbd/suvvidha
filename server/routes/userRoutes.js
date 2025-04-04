const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  toggleUserStatus,
  createDefaultUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/create-defaults', createDefaultUsers);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('idProofDocument'), updateUserProfile);

// Admin routes
router.get('/', protect, admin, getUsers);
router.put('/:id/toggle-status', protect, admin, toggleUserStatus);

module.exports = router;