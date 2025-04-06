const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAdminBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  assignVendor,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.route('/')
  .post(protect, createBooking)
  .get(protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

// Admin routes
router.route('/admin')
  .get(protect, admin, getAdminBookings);

router.route('/:id/status')
  .put(protect, admin, updateBookingStatus);

router.route('/:id/assign')
  .put(protect, admin, assignVendor);

module.exports = router;