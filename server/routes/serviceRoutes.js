const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);
router.get('/category/:category', getServicesByCategory);

// Admin routes
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;