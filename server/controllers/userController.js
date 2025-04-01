const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'customer',
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profileImage: updatedUser.profileImage,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Create default users (admin, vendor, customer)
// @route   POST /api/users/create-defaults
// @access  Public (should be secured in production)
const createDefaultUsers = asyncHandler(async (req, res) => {
  // Check if default users already exist
  const adminExists = await User.findOne({ email: 'admin@suvvidha.com' });
  const vendorExists = await User.findOne({ email: 'vendor@suvvidha.com' });
  const customerExists = await User.findOne({ email: 'customer@suvvidha.com' });

  if (adminExists && vendorExists && customerExists) {
    return res.status(400).json({ message: 'Default users already exist' });
  }

  const users = [];

  // Create admin if doesn't exist
  if (!adminExists) {
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@suvvidha.com',
      password: 'admin123',
      role: 'admin',
    });
    users.push({ name: admin.name, email: admin.email, role: admin.role });
  }

  // Create vendor if doesn't exist
  if (!vendorExists) {
    const vendor = await User.create({
      name: 'Vendor User',
      email: 'vendor@suvvidha.com',
      password: 'vendor123',
      role: 'vendor',
    });
    users.push({ name: vendor.name, email: vendor.email, role: vendor.role });
  }

  // Create customer if doesn't exist
  if (!customerExists) {
    const customer = await User.create({
      name: 'Customer User',
      email: 'customer@suvvidha.com',
      password: 'customer123',
      role: 'customer',
    });
    users.push({ name: customer.name, email: customer.email, role: customer.role });
  }

  res.status(201).json({
    message: 'Default users created successfully',
    users,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  createDefaultUsers,
};