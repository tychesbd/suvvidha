const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');

// @desc    Get dashboard statistics for admin
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Get user count
    const userCount = await User.countDocuments({ role: 'customer' });
    
    // Get vendor count
    const vendorCount = await User.countDocuments({ role: 'vendor' });
    
    // Get booking count
    const bookingCount = await Booking.countDocuments({});
    
    // Get service count
    const serviceCount = await Service.countDocuments({});
    
    res.json({
      users: userCount,
      vendors: vendorCount,
      bookings: bookingCount,
      services: serviceCount
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching dashboard statistics: ' + error.message);
  }
});

module.exports = {
  getDashboardStats,
};